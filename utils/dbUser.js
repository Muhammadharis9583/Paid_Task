exports.saveUserInDB = async (profile) => {
  let newUser;
  newUser = new User({
    name: profile.displayName,
    email: profile.emails[0].value,
    providers: [{ provider: 'google', id: profile.sub }],
  });

  try {
    await newUser.save({ validateBeforeSave: false });
  } catch (error) {}

  return newUser;
};
