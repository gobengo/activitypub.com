import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import * as cloud from '@pulumi/cloud';
import * as cloudAws from '@pulumi/cloud-aws';
import { Config, getStack, StackReference } from "@pulumi/pulumi";

const stackConfig = new pulumi.Config("activitypub.com-cloud");

export const service = new cloud.Service("example", {
    containers: {
        nginx: {
            build: "./app",
            memory: 128,
            ports: [{ port: 80 }],
        },
    },
    replicas: 2,
});

// export just the hostname property of the container frontend
exports.url = service.defaultEndpoint.apply(e => `http://${e.hostname}`);

// exports.loadBalancer = (service.defaultEndpoint as pulumi.Output<cloudAws.Endpoint>).loadBalancer

const apexDnsStack = new StackReference(stackConfig.require("apex-dns-stack"));
export const apexZone: pulumi.OutputInstance<aws.route53.Zone> = apexDnsStack.getOutput('apexZone')
export const apexZoneId = apexDnsStack.getOutput('apexZoneId')
export const apexZoneName = apexDnsStack.getOutput('apexZoneName')

export const wwwRecord = new aws.route53.Record(`www-record`, {
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
