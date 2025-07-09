const passport = require("passport");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcryptjs");
const prisma = require("../prisma/client");

passport.use(
    new LocalStrategy(async (email, password, done) => {
        try {
            
            const user = await prisma.user.findUnique({
                where: { email: email },
            })
            
            if (!user) {
                return done(null, false, { message: "Incorrect email"});
            }

            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                return done(null, false, { message: "Incorrect password" });
            }

            return done(null, user);
        } catch(err) {
            return done(err);
        }
    })
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: id }
        });

        done(null, user);
    } catch(err) {
        done(err);
    }
});