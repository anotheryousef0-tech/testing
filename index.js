const { metro, patcher, storage, commands } = vendetta;
const { React } = metro.common;

const MessageHeader = metro.find(m => m.default?.displayName === "MessageHeader");
const { Text } = metro.common.Components;

export default {
    onLoad: () => {
        // Plugin by Wpee2L
        const unregister = commands.registerCommand({
            name: "setnickname",
            description: "Set a local red nickname (Plugin by Wpee2L)",
            options: [
                {
                    name: "user",
                    description: "The user to nickname",
                    type: 6,
                    required: true,
                },
                {
                    name: "nick",
                    description: "The nickname to display",
                    type: 3,
                    required: true,
                }
            ],
            execute: (args, ctx) => {
                const userId = args[0].value;
                const nickname = args[1].value;
                storage[userId] = nickname;
                return { content: `[Wpee2L System]: Nickname "${nickname}" has been set for this user.` };
            }
        });

        this.unregisterCommand = unregister;

        this.unpatch = patcher.after("default", MessageHeader, ([{ message }], res) => {
            const customAlias = storage[message.author.id];
            if (customAlias) {
                const headerChildren = res.props.children[1].props.children;
                headerChildren.push(
                    React.createElement(Text, {
                        style: {
                            color: "#FF0000",
                            fontWeight: "bold",
                            marginLeft: 4,
                            fontSize: 12,
                        }
                    }, `[${customAlias}]`)
                );
            }
        });
    },
    onUnload: () => {
        if (this.unregisterCommand) this.unregisterCommand();
        if (this.unpatch) this.unpatch();
    }
};
