export default function cifrarRol(roles) {
    roles.sort(function(a, b) {
      return a - b;
    });

    let rol = 0
    switch (roles.length) {
        case (2):
            rol = 3            
            break;
        case (1):
            rol = roles[0]    
            break;
        case (0):
            rol = 0
            break;
    }
    return rol
  }