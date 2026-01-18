(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.RedNick = factory());
}(this, (function () { 'use strict';

    const { metro, patcher, commands, storage } = window.vendetta;
    const React = metro.common.React;
    const { Text } = metro.common.Components;
    const MessageHeader = metro.find(m => m.default?.displayName === "MessageHeader");

    return {
        onLoad: () => {
            const unreg = commands.registerCommand({
                name: "setnickname",
                description: "Set nick - Wpee2L",
                options: [
                    { name: "user", description: "user", type: 6, required: true },
                    { name: "nick", description: "nick", type: 3, required: true }
                ],
                execute: (args) => {
                    const userId = args[0].value;
                    const nickname = args[1].value;
                    storage[userId] = nickname;
                    return { content: "Saved locally for: " + userId };
                }
            });

            const unpatch = patcher.after("default", MessageHeader, ([{ message }], res) => {
                const custom = storage[message.author.id];
                if (custom) {
                    const children = res.props.children[1].props.children;
                    children.push(React.createElement(Text, {
                        style: { color: "#FF0000", fontWeight: "bold", marginLeft: 4 }
                    }, "[" + custom + "]"));
                }
            });

            this.cleanup = () => { unreg(); unpatch(); };
        },
        onUnload: () => {
            if (this.cleanup) this.cleanup();
        }
    };
})));
