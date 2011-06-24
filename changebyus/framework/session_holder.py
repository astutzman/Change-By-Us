"""
Singleton allows the session object to be passed between classes
Putting it here means we wont lose it if webpy reloads controller classes

"""
class SessionHolder():

    session = None
    
    @classmethod
    def set(cls, _session):
        cls.session = _session
        
    @classmethod
    def get_session(cls):
        return cls.session