const { metro, patcher, storage } = vendetta;
const { React } = metro.common;

const MessageHeader = metro.find(m => m.default?.displayName === "MessageHeader");
const { Text } = metro.common.Components;
const ActionSheet = metro.find(m => m.default?.displayName === "ActionSheet" || m.ActionSheet);

const plugin = {
    onLoad: () => {
        // 1. إضافة اللقب الأحمر في الشات
        plugin.unpatchHeader = patcher.after("default", MessageHeader, ([{ message }], res) => {
            const customNick = storage[message.author.id];
            if (customNick) {
                const headerChildren = res.props.children[1].props.children;
                headerChildren.push(
                    React.createElement(Text, {
                        style: { color: "#FF0000", fontWeight: "bold", marginLeft: 4, fontSize: 12 }
                    }, `[${customNick}]`)
                );
            }
        });

        // 2. تجربة تفعيل بدون أوامر (فقط تعديل الشات)
    },
    onUnload: () => {
        plugin.unpatchHeader?.();
    }
};

export default plugin;
