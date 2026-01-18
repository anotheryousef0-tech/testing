import { metro, patcher, storage, commands } from "@vendetta";
import { React } from "@vendetta/metro/common";

const MessageHeader = metro.find(m => m.default?.displayName === "MessageHeader");
const { Text } = metro.common.Components;

export default {
    onLoad: () => {
        // 1. Register the Slash Command
        this.unregisterCommand = commands.registerCommand({
            name: "setnickname",
            description: "Set a local red nickname for a user",
            options: [
                {
                    name: "user",
                    description: "The user to nickname",
                    type: 6, // User type
                    required: true,
                },
                {
                    name: "nick",
                    description: "The nickname to display",
                    type: 3, // String type
                    required: true,
                }
            ],
            execute: (args, ctx) => {
                const userId = args[0].value;
                const nickname = args[1].value;
                
                // Save to local storage
                storage[userId] = nickname;
                
                return { content: `Successfully set nickname "${nickname}" for user ${userId}.` };
            }
        });

        // 2. Patch the Chat Header to show the nickname
        this.unpatch = patcher.after("default", MessageHeader, ([{ message }], res) => {
            const authorId = message.author.id;
            const customAlias = storage[authorId];

            if (customAlias) {
                const headerChildren = res.props.children[1].props.children;
                
                headerChildren.push(
                    React.createElement(Text, {
                        style: {
                            color: "#FF0000", // Red color
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
        this.unregisterCommand?.();
        this.unpatch?.();
    }
};
