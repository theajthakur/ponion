const handleShowUserProfile = async (req, res) => {
  return res.json({ status: "success", beta: req.user });
};
