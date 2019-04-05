export default function DescifrarRol(rol) {
    let roles = []
    switch (rol) {
        case (1):
            roles.push(1)
            break;
        case (2):
            roles.push(2)
            break;
        case (3):
            roles.push(1,2)
            break;
    }
    
    return roles
  }