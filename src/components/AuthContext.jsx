import { createContext, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user_id, setUserId] = useState({
user:"",
token:"",
  });
console.log(user_id,'AuthContext');

  return (
    <AuthContext.Provider value={{ user_id,setUserId,  }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
