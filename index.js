import { metro, patcher, storage, commands } from "@vendetta";
import { React } from "@vendetta/metro/common";

const MessageHeader = metro.find(m => m.default?.displayName === "MessageHeader");
const { Text } = metro.common.Components;

export default {
    onLoad: () => {
        // Plugin by Wpee2L
        const setNickCommand = commands.registerCommand({
            name: "setnickname",
            description: "Set local nick for a user (Wpee2L System)",
            options: [
                { name: "user", description: "Select user", type: 6, required: true },
                { name: "nick", description: "Enter nickname", type: 3, required: true }
            ],
            execute: (args) => {
                const userId = args[0].value;
                const nickname = args[1].value;
                storage[userId] = nickname;
                return { content: "Wpee2L System: Nickname saved locally." };
            }
        });

        const patch = patcher.after("default", MessageHeader, ([{ message }], res) => {
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

        // Store for unloading
        window.wpee2l_command = setNickCommand;
        window.wpee2l_patch = patch;
    },
    onUnload: () => {
        if (window.wpee2l_command) window.wpee2l_command();
        if (window.wpee2l_patch) window.wpee2l_patch();
    }
};
