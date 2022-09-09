import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import * as cloud from '@pulumi/cloud';
import * as cloudAws from '@pulumi/cloud-aws';
import { Config, getStack, StackReference } from "@pulumi/pulumi";

const stackConfig = new pulumi.Config("activitypub.com-cloud");

const service = new cloud.Service("webapp", {
    containers: {
        nginx: {
            build: "./app",
            memory: 128,
            ports: [{ port: 80 }],
            environment: {
                APP_DID_ALSOKNOWNAS: stackConfig.require('APP_DID_ALSOKNOWNAS')
            }
        },
    },
    replicas: 2,
});

// load balancer dns url
const serviceUrl = service.defaultEndpoint.apply(e => `http://${e.hostname}`);

const apexDnsStack = new StackReference(stackConfig.require("apex-dns-stack"));
const apexZone: pulumi.OutputInstance<aws.route53.Zone> = apexDnsStack.getOutput('apexZone')

const wwwRecord = new aws.route53.Record(`www-record`, {
    type: 'A',
    name: apexZone.apply(z => `www.${z.name}`),
    zoneId: apexZone.apply(z => z.id),
    aliases: [
        {
            name: service.defaultEndpoint.apply(e => (e as cloudAws.Endpoint).loadBalancer.dnsName),
            zoneId: service.defaultEndpoint.apply(e => (e as cloudAws.Endpoint).loadBalancer.zoneId),
            evaluateTargetHealth: false,
    
        }
    ]
})

export const url = wwwRecord.name
