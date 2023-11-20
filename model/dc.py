import dbresource


class Datacenter(dbresource.LabResource):
    def __init__(self, id, name, address) -> None:
        super(dbresource.LabResource, self).__init__(id, name)
        self.Address = address
        self.LabIDs = set() # set of lab IDs
