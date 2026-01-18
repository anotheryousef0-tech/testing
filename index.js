const { commands, storage } = vendetta;

export default {
    onLoad: () => {
        try {
            const unregister = commands.registerCommand({
                name: "setnickname",
                description: "Save a local nick - Wpee2L",
                options: [
                    { name: "user", description: "user", type: 6, required: true },
                    { name: "nick", description: "nick", type: 3, required: true }
                ],
                execute: (args) => {
                    const userId = args[0].value;
                    const nickname = args[1].value;
                    storage[userId] = nickname;
                    return { content: "Saved: " + nickname };
                }
            });
            this.unregister = unregister;
        } catch (e) {
            console.error(e);
        }
    },
    onUnload: () => {
        if (this.unregister) this.unregister();
    }
};
