# Known Issues

| Title | Issue   | Root Cause | Jira | Status |
|-      |-        |-           |-     |-       |
| Can't resolve Gitlab | Frontend deployments are unavailable. App deploys may fail with `Deployment Failed: DNS lookup failed for 'gitlab.cee.redhat.com' -- check network connection (is VPN needed?)` | Gitlab is on the Red Hat network. Firelink runs outside the network on Openshift, and thus cann't reach Gitlab. Networking changes and assistance from IT or App SRE are required to solve this problem. | RHCLOUD-27399 | Unresolved |