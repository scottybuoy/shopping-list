const { User, List, Checklist } = require('../models');

const sendList = async (req, res) => {
    let listToSend = null;
    let fieldToUpdate = null;
    if (req.body.typeOfList === 'shoppingList') {
        listToSend = await List.findById(req.body.listId);
    } else {
        listToSend = await Checklist.findById(req.body.listId);
    };

    if (!listToSend) {
        return res.status(400).json({ message: 'failed to find list' });
    };

    listToSend.sentBy = req.body.sentBy;
    listToSend.save();

    req.body.typeOfList === 'shoppingList' ? fieldToUpdate = 'receivedLists' : fieldToUpdate = 'receivedChecklists';


    const listRecipient = await User.findOneAndUpdate(
        { _id: req.body.recipientId },
        { $addToSet: { [fieldToUpdate]: listToSend } },
        { new: true, runValidotors: true }
    );

    if (!listRecipient) {
        return res.status(400).json({ message: 'failed to send list to user' });
    };

    return res.status(200).json(listRecipient);
}

const getReceivedLists = async (req, res) => {

    const receivedLists = await User.findById(req.params.userId)
        .populate(['receivedLists', 'receivedChecklists']);

    if (!receivedLists) {
        return res.status(400).json({ message: 'failed to find received lists' })
    }

    return res.status(200).json(receivedLists);
};

const deleteReceivedList = async (req, res) => {
    const updatedUser = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $pull: { receivedLists: req.body.receivedListId } },
        { new: true, runValidotors: true }
    )

    if (!updatedUser) {
        return res.status(400).json({ message: 'cannot remove received list from user' })
    };

    return res.status(200).json(updatedUser);
}

const saveReceivedList = async (req, res) => {
    const updatedList = await List.findById(req.body.receivedListId);

    if (!updatedList) {
        return res.status(400).json({ message: 'could not find received list' })
    }

    updatedList.sentBy = '';
    updatedList.save();

    const updatedUser = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $addToSet: { lists: updatedList } },
        { new: true, runValidotors: true }
    );

    updatedUser.receivedLists.pull(req.body.receivedListId)
    updatedUser.save();

    if (!updatedUser) {
        return res.status(400).json({ message: 'failed to add received list to user' })
    };

    return res.status(200).json(updatedUser);

};

const saveReceivedChecklist = async (req, res) => {
    const updatedChecklist = Checklist.findById(req.body.checklistId);

    if (!updatedChecklist) {
        return res.status(400).json({ message: 'unable to find checklist' })
    }

    updatedChecklist.sentBy = ''
    updatedChecklist.save();

    const updatedUser = User.findOneAndUpdate(
        { _id: req.body.userId },
        { $addToSet: { checklists: req.body.checklistId } },
        { new: true, runValidotors: true }
    );

    if (!updatedUser) {
        return res.status(400).json({message: 'unable to save received checklist'})
    };

    return res.status(200).json(updatedUser);
};

const findRecipient = async (req, res) => {
    const user = await User.find({ username: req.params.username });
    if (!user) {
        return res.status(400).json({ message: 'unable to find user' });
    }

    return res.status(200).json(user);
}

module.exports = {
    sendList,
    getReceivedLists,
    saveReceivedList,
    saveReceivedChecklist,
    findRecipient,
    deleteReceivedList,
}