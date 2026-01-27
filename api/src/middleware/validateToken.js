const { verifyToken } = require("../authentication/auth");

// req = request  
// res = response 
function validateToken(req, res, next) {
  const authHeader = req.headers["authorization"];//extrage caloarea headerului "authorization" din request
  const token = authHeader && authHeader.split(" ")[1];//extrage DOAR tokenul

  if (!token) {// se verifica daca exista tokenul => daca nu exista => 401
    return res.status(401).json({ // 401 => user neautentificat
        error: "No token found" 
    });
  }

  const decoded = verifyToken(token);//daca tokenul este valid => datele userului
  if (!decoded) { // se verificata daca tokenul este valid => daca nu e oki => 403 
    return res.status(403).json({ 
        error: "Invalid or expired token" 
    });
  }

  req.user = decoded;
  next();
}

module.exports = { validateToken };