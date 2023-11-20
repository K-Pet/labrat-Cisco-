import dbresource


class VM(dbresource.LabResource):
    def __init__(self, id, name) -> None:
        super(dbresource.LabResource, self).__init__(id, name)
        self.SerialNumber = None
        self.BoardIP = None
        self.Model = None
        self.OS = None
        self.Cores = None
        self.Memory = None
        self.Storage = None
