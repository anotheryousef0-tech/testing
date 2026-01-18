(function() {
    const { metro, patcher, storage } = window.vendetta;
    const { React } = metro.common;
    const MessageHeader = metro.find(m => m.default?.displayName === "MessageHeader");
    const { Text } = metro.common.Components;

    return {
        onLoad: () => {
            // Wpee2L System
            this.unpatch = patcher.after("default", MessageHeader, ([{ message }], res) => {
                const nick = storage[message.author.id];
                if (nick) {
                    const children = res.props.children[1].props.children;
                    children.push(
                        React.createElement(Text, {
                            style: { color: "#FF0000", fontWeight: "bold", marginLeft: 4, fontSize: 12 }
                        }, "[" + nick + "]")
                    );
                }
            });
        },
        onUnload: () => {
            if (this.unpatch) this.unpatch();
        }
    };
})();
