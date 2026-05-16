import authService from "../service/auth-service.js";

async function signup(req, res) {
    try {
        const { username, password } = req.body;
        const token = await authService.signup(username, password);
        res.clearCookie("paintings");
        res.json({ token });
    } catch (err) {
        res.status(err.status || 500).send(err.message);
    }
}

async function login(req, res) {
    try {
        const { username, password } = req.body;
        const token = await authService.login(username, password);
        res.clearCookie("paintings");
        res.json({ token });
    } catch (err) {
        res.status(err.status || 500).send(err.message);
    }
}

async function deleteUser(req, res) {
    try {
        await authService.deleteUser(req.user.username);
        res.sendStatus(200);
    } catch (err) {
        res.status(err.status || 500).send(err.message);
    }
}

export default { signup, login, deleteUser };
