import uuid

import 


class LabResource:
    def __init__(self, id, name) -> None:
        self.ID = id
        self.Name = name
        self.Description = ""
        self.Owner = ""
        self.CreationTime = None
        self.LastModifiedTime = None
        self. = .()

        if id == None:
            self.ID = new_uuid()

def new_uuid():
    return str(uuid.uuid4())