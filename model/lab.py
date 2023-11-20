import dbresource


class Lab(dbresource.LabResource):
    def __init__(self, id, name) -> None:
        super(dbresource.LabResource, self).__init__(id, name)
        self.RackIDs = set() # set of rack IDs

class Rack(dbresource.LabResource):
    def __init__(self, id, name) -> None:
        super().__init__(id, name)
        self.ServerIDs = dict()
        self.SwitchIDs = dict()