
export const mergeAllRoles = (roles)=>{

    const allRoles = Object.keys(roles);

    const uniqueRoles = Array.from(new Set(allRoles));

    return uniqueRoles;

}
