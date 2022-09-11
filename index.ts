import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import { Config, getStack, StackReference } from "@pulumi/pulumi";
import { ContainerPortMappingProvider } from "@pulumi/awsx/ecs";

const stackConfig = new pulumi.Config("activitypub.com-cloud");

const apexDnsStack = new StackReference(stackConfig.require("apex-dns-stack"));
const apexZone: pulumi.OutputInstance<aws.route53.Zone> = apexDnsStack.getOutput('apexZone')
export const apexZoneName = apexZone.apply(z => z.name)

const wwwName = apexZone.apply(z => `www.${z.name}`)

// apex certificate
const apexCertificate = new aws.acm.Certificate("apexCertificate", {
    domainName: apexZone.apply(z => z.name),
    validationMethod: "DNS",
});
export const apexCertificateStatus = apexCertificate.status
const apexCertificateValidationRecords = validationRecordsFqdnsForCertificate(apexCertificate);
const apexCertificateValidation = new aws.acm.CertificateValidation("apexCertificateValidation", {
    certificateArn: apexCertificate.arn,
    validationRecordFqdns: apexCertificateValidationRecords.apply(records => records.map(r => r.fqdn)),
});

// www https
const wwwCertificate = new aws.acm.Certificate("wwwCertificate", {
    domainName: wwwName,
    validationMethod: "DNS",
});
export const wwwCertificateStatus = wwwCertificate.status
const wwwCertificateValidationRecords = validationRecordsFqdnsForCertificate(wwwCertificate);
const wwwCertificateValidation = new aws.acm.CertificateValidation("wwwCertificateValidation", {
    certificateArn: wwwCertificate.arn,
    validationRecordFqdns: wwwCertificateValidationRecords.apply(records => records.map(r => r.fqdn)),
});

/**
 * Given an ACM certificate, returns a list of Route53 records that must be created in order to validate it
 * @param certificate 
 * @returns array of aws.route53.Record
 */
function validationRecordsFqdnsForCertificate(certificate: aws.acm.Certificate) {
    const domainValidationRecords = certificate.domainValidationOptions.apply((options) => {
        return options.map(option => {
            console.log('validationRecord', option.resourceRecordName)
            return new aws.route53.Record(`wwwValidationRecord-${option.domainName}`, {
                allowOverwrite: true,
                name: option.resourceRecordName,
                records: [option.resourceRecordValue],
                type: option.resourceRecordType,
                zoneId: apexZone.apply(z => z.id),
                ttl: 60,
            })
        })
    })
    return domainValidationRecords;
}

// Allocate a new VPC with the default settings:
const vpc = new awsx.ec2.Vpc("app", {});// Export a few resulting fields to make them easy to use:
export const vpcId = vpc.id;
export const vpcPrivateSubnetIds = vpc.privateSubnetIds;
export const vpcPublicSubnetIds = vpc.publicSubnetIds;

// container image repo
const repo = new awsx.ecr.Repository("appRepo");

// Creates an ALB associated with our custom VPC.
const alb = new awsx.lb.ApplicationLoadBalancer(
    `app`, { vpc }
);

// // Target group with the port of the Docker image
// const wwwHttpsTarget = alb.createTargetGroup(
//     "www-https",
//     {
//         vpc,
//         port: 80,
//         deregistrationDelay: 0,
//         healthCheck: {
//             path: "/",
//         }
//     }
// );

const appHttpTarget = alb.createTargetGroup(
    "app-http",
    {
        vpc,
        port: 80,
        // deregistrationDelay: 0,
        // healthCheck: {
        //     path: "/",
        // }
    }
);

// Listen to HTTP traffic on the app port and redirect to 443
// const httpToHttpsRedirectListener = alb.createListener("web-http", {
//     vpc,
//     port: 80,
//     protocol: "HTTP",
//     // defaultAction: {
//     //     type: "redirect",
//     //     redirect: {
//     //         protocol: "HTTPS",
//     //         port: "443",
//     //         statusCode: "HTTP_301",
//     //     },
//     // },
// });

// const wwwHttpsListener = wwwHttpsTarget.createListener("web-https", {
//     port: 443,
//     certificateArn: wwwCertificateValidation.certificateArn
// });

const apexHttpsListener = appHttpTarget.createListener("apex-https", {
    port: 443,
    certificateArn: apexCertificateValidation.certificateArn,
})

// const additionalWwwCertOnHttpsListener = new aws.lb.ListenerCertificate("additionalWwwCertOnHttpsListener", {
//     listenerArn: httpsListener.listener.arn,
//     certificateArn: wwwCertificateValidation.certificateArn
// })

const httpToAppListener = appHttpTarget.createListener("app-http", {
    port: 80,
    protocol: "HTTP",
})

// Create a DNS record for the load balancer
const apexRecordToAlb = new aws.route53.Record(`apexRecordToAlb`, {
    name: apexZone.apply(z => z.name),
    zoneId: apexZone.apply(z => z.id),
    type: "A",
    aliases: [{
        name: apexHttpsListener.loadBalancer.loadBalancer.dnsName,
        evaluateTargetHealth: true,
        zoneId: apexHttpsListener.loadBalancer.loadBalancer.zoneId
    }],
});

// const wwwRecordToAlb = new aws.route53.Record(`wwwRecordToAlb`, {
//     name: wwwName,
//     zoneId: apexZone.apply(z => z.id),
//     type: "CNAME",
//     records: [httpsListener.endpoint.hostname],
//     ttl: 60,
// });

// load balancer for ecs-fargate-powered app
const cluster = new awsx.ecs.Cluster("app", {
    vpc,
    tags: {
        "Name": "activitypub.com",
    },
});

// required on mac m1
// https://github.com/pulumi/pulumi-docker/issues/296#issuecomment-1030094518
process.env.DOCKER_DEFAULT_PLATFORM = 'linux/amd64'
const appImage = repo.buildAndPushImage({
    context: "./app",
})

// serve domain apex over http, https
const appApexService = new awsx.ecs.FargateService("apex", {
    cluster,
    taskDefinitionArgs: {
        containers: {
            apexHttp: {
                image: appImage,
                environment: [
                    {
                        name: 'APP_DID_ALSOKNOWNAS',
                        value: stackConfig.require('APP_DID_ALSOKNOWNAS')
                    },
                    {
                        name: 'APP_DID',
                        value: apexZoneName.apply(name => `did:web:${name}`)
                    }
                ],
                memory: 512,
                portMappings: [
                    apexHttpsListener,
                ],                
            },
        },
    },
    desiredCount: 2,
});

export const appApexServiceName = appApexService.service.name
// export const url = wwwRecordToAlb.name
export const apexHttpsListenerHostname = apexHttpsListener.endpoint.hostname
// export const httpToAppListenerHostname = httpToAppListener.endpoint.hostname
// export const httpsListenerHostname = httpsListener.endpoint.hostname
