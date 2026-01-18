const { metro, patcher, commands } = window.vendetta;
const React = metro.common.React;
const { Text } = metro.common.Components;
const MessageHeader = metro.find(m => m.default?.displayName === "MessageHeader");

// storage in Kettu is often found in plugin object or window
const storage = {}; 

const plugin = {
    onLoad: () => {
        try {
            const unregister = commands.registerCommand({
                name: "setnickname",
                description: "Local nick - Wpee2L",
                options: [
                    { name: "user", description: "user", type: 6, required: true },
                    { name: "nick", description: "nick", type: 3, required: true }
                ],
                execute: (args) => {
                    const userId = args[0].value;
                    const nickname = args[1].value;
                    storage[userId] = nickname;
                    return { content: "Wpee2L: Done!" };
                }
            });

            const unpatch = patcher.after("default", MessageHeader, ([{ message }], res) => {
                const myNick = storage[message.author.id];
                if (myNick) {
                    const children = res.props.children[1].props.children;
                    children.push(
                        React.createElement(Text, {
                            style: { color: "#FF0000", fontWeight: "bold", marginLeft: 4 }
                        }, "[" + myNick + "]")
                    );
                }
            });

            plugin.cleanup = () => { unregister(); unpatch(); };
        } catch (e) {
            console.error(e);
        }
    },
    onUnload: () => {
        if (plugin.cleanup) plugin.cleanup();
    }
};

// Important for Kettu
window.wpee2lPlugin = plugin;
export default plugin;
