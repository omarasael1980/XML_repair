import jwt from 'jsonwebtoken';

const jwtGenerator = (id) => {
    console.log(process.env.JWT_SECRET);
    return jwt.sign({ id:  id }, process.env.JWT_SECRET, { expiresIn: "1h"})
}
const jwtValidator = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded;
    } catch (error) {
        return null;
    }
}
export { jwtGenerator, jwtValidator }