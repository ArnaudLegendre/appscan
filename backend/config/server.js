module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 8092),
  admin: {
    auth: {
      secret: env('ADMIN_JWT_SECRET', 'd038740fb832ceda5efd9dc336dc5dd2'),
    },
  },
});
