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
export const apexZoneId = apexZone.id
export const apexZoneName = apexZone.name

// Split a domain name into its subdomain and parent domain names.
// e.g. "www.example.com" => "www", "example.com".
// via https://github.com/pulumi/examples/blob/master/aws-ts-static-website/index.ts
function getDomainAndSubdomain(domain: string): { subdomain: string, parentDomain: string } {
    const parts = domain.split(".");
    if (parts.length < 2) {
        throw new Error(`No TLD found on ${domain}`);
    }
    // No subdomain, e.g. awesome-website.com.
    if (parts.length === 2) {
        return { subdomain: "", parentDomain: domain };
    }

    const subdomain = parts[0];
    parts.shift();  // Drop first element.
    return {
        subdomain,
        // Trailing "." to canonicalize domain.
        parentDomain: parts.join(".") + ".",
    };
}

