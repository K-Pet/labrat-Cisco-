# labrat - lab resource allocation tool

labrat manages lab inventory and provides a way to allocate resources to users.
labrat has two primary components, inventory management and a resource
allocation system.

## Inventory management

labrat manages lab inventory as a set of interdependent resources. A resource
is any entity in the lab, physical or virtual. For example, switches, routers,
power units, racks are physical entities. Virtual machines, IP addresses, VLANs,
subnets are virtual entities. Resources are related to each other, for example
an IP address can be allocated to a virtual machine temporarily or permanently.
Once assigned it cannot be allocated to any other virtual machine. This is a
constraint.

### Standard Resource definitions

labrat comes with a set of standard resource definitions that are common to most
labs.

__Physical Resources:__

1. Location
1. Lab
1. Row
1. Rack
1. Power Unit
1. Switch
1. Server
1. Storage

__Virtual Resources:__

1. VLAN
1. Subnet
1. IP Address
1. DNS Name
1. Virtual Machine
1. Hypervisor

labrat provides a REST interface to create, update, delete and query resources.
