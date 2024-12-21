import User from "./UserModel.js";

const getUserDetail = async (req, res) => {
  const user = req.user;
  if (!user) {
    res.status(404).json("Missing user in request!");
    return;
  }
  try {
    const userId = user._id;
    const currentUser = await User.findById(userId);
    if (!currentUser) {
      res.status(404).json("Could not find User");
      return;
    }

    res.status(200).json(currentUser);
  } catch (error) {
    res.status(500).json(error);
  }
};

const updateUser = async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(404).json({ message: "Missing user in request!" });
  }

  const update = req.body; // Assuming req.body comes with {wishlist: [], cart: [], address: {}}

  try {
    const userId = user._id;
    const currentUser = await User.findById(userId);

    if (!currentUser) {
      return res.status(404).json({ message: "Could not find User" });
    }

    // Handle updating the wishlist
    if (update.wishlist && Array.isArray(update.wishlist)) {
      update.wishlist.forEach((newItem) => {
        User.updateOne(
          { _id: userId },
          { $addToSet: { wishlist: newItem } } // Add unique items to wishlist
        );
      });
    }

    // Handle updating the cart
    if (update.cart && Array.isArray(update.cart)) {
      update.cart.forEach((newItem) => {
        User.updateOne(
          { _id: userId },
          { $addToSet: { cart: newItem } } // Add unique items to cart
        );
      });
    }


    // Handle updating the address
    if (update.address && typeof update.address === "object") {
      const newAddress = update.address; // The address object

      
      if (
        !currentUser.name ||
        currentUser.name.trim() === "" ||
        currentUser.name === "Sugar Fan"
      ) {
        // If name is empty or "Sugar Fan", update the name field with firstName and lastName
        const fullName = `${newAddress.firstName} ${
          newAddress.lastName || ""
        }`.trim();
        await User.updateOne(
          { _id: userId },
          {
            $set: { name: fullName }, // Update the user's name field
            $push: { address: newAddress }, // Add the new address to the address array
          }
        );
      } else {
        // If name is not empty and not "Sugar Fan", just push the address to the address array
        await User.updateOne(
          { _id: userId },
          { $push: { address: newAddress } } // Add the new address to the array
        );
      }
    }

    // Respond with the updated user information or a success message
    res.status(200).json({
      message: "User updated successfully",
      user: currentUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export { getUserDetail, updateUser };
