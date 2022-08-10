import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";

const stackConfig = new pulumi.Config("apex-dns");
const config = {
    fqdn: stackConfig.require('fqdn')
}
export const apexZone = new aws.route53.Zone('apex', {
    name: config.fqdn
})
