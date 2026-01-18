const { metro, patcher, storage, commands } = vendetta;
const { React } = metro.common;

const MessageHeader = metro.find(m => m.default?.displayName === "MessageHeader");
const { Text } = metro.common.Components;

function onLoad() {
    // Plugin by Wpee2L
    this.unregisterCommand = commands.registerCommand({
        name: "setnickname",
        description: "Set a local red nickname (Wpee2L System)",
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
            return { content: "Wpee2L System: Nickname has been set." };
        }
    });

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
                }, "[" + customAlias + "]")
            );
        }
    });
}

function onUnload() {
    this.unregisterCommand?.();
    this.unpatch?.();
}

export default {
    onLoad,
    onUnload
};
