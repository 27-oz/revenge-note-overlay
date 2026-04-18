// Note Overlay — Revenge/Bunny Plugin
// Uses window.bunny globals (no ES module syntax — Revenge loads this directly)

(function () {
  // ── Grab APIs from Bunny's global ──────────────────────────────────────────
  var metro   = window.bunny.metro;
  var patcher = window.bunny.patcher;
  var storage = window.bunny.plugin.storage;

  // React & React Native come from Discord's own Metro bundle
  var React   = metro.findByProps("createElement", "useState");
  var RN      = metro.findByProps("View", "Text", "StyleSheet", "Dimensions");

  var View               = RN.View;
  var Text               = RN.Text;
  var TextInput          = RN.TextInput;
  var TouchableOpacity   = RN.TouchableOpacity;
  var StyleSheet         = RN.StyleSheet;
  var Dimensions         = RN.Dimensions;
  var KeyboardAvoidingView = RN.KeyboardAvoidingView;
  var Platform           = RN.Platform;

  // ── Styles ─────────────────────────────────────────────────────────────────
  var styles = StyleSheet.create({
    fab: {
      position: "absolute",
      bottom: 80,
      right: 16,
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: "#5865F2",
      alignItems: "center",
      justifyContent: "center",
      elevation: 8,
      zIndex: 9999,
    },
    fabText: { fontSize: 22 },
    noteCard: {
      position: "absolute",
      bottom: 140,
      right: 16,
      width: Dimensions.get("window").width * 0.75,
      backgroundColor: "#2B2D31",
      borderRadius: 12,
      padding: 12,
      elevation: 10,
      zIndex: 9998,
      borderWidth: 1,
      borderColor: "#3D3F45",
    },
    noteHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
    },
    noteTitle: {
      color: "#B5BAC1",
      fontSize: 11,
      fontWeight: "600",
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    clearBtn:  { color: "#ED4245", fontSize: 11, fontWeight: "600" },
    noteInput: {
      color: "#DCDDDE",
      fontSize: 14,
      minHeight: 100,
      maxHeight: 200,
      textAlignVertical: "top",
      padding: 0,
    },
    charCount: { color: "#6B6F77", fontSize: 10, textAlign: "right", marginTop: 4 },
  });

  // ── Component ──────────────────────────────────────────────────────────────
  function NoteOverlay() {
    var openState = React.useState(false);
    var open      = openState[0];
    var setOpen   = openState[1];

    var textState = React.useState(storage.noteText || "");
    var text      = textState[0];
    var setText   = textState[1];

    function handleChange(val) {
      setText(val);
      storage.noteText = val;
    }

    function handleClear() {
      setText("");
      storage.noteText = "";
    }

    var children = [
      React.createElement(
        TouchableOpacity,
        { key: "fab", style: styles.fab, onPress: function () { setOpen(function (o) { return !o; }); } },
        React.createElement(Text, { style: styles.fabText }, "📝")
      ),
    ];

    if (open) {
      children.push(
        React.createElement(
          KeyboardAvoidingView,
          { key: "card", style: styles.noteCard, behavior: Platform.OS === "ios" ? "padding" : "height" },
          React.createElement(
            View,
            { style: styles.noteHeader },
            React.createElement(Text, { style: styles.noteTitle }, "Quick Note"),
            React.createElement(
              TouchableOpacity,
              { onPress: handleClear },
              React.createElement(Text, { style: styles.clearBtn }, "Clear")
            )
          ),
          React.createElement(TextInput, {
            style: styles.noteInput,
            value: text,
            onChangeText: handleChange,
            placeholder: "Type a note…",
            placeholderTextColor: "#6B6F77",
            multiline: true,
            autoFocus: true,
            maxLength: 500,
          }),
          React.createElement(Text, { style: styles.charCount }, text.length + "/500")
        )
      );
    }

    return React.createElement(React.Fragment, null, children);
  }

  // ── Patch & lifecycle ──────────────────────────────────────────────────────
  var unpatch;

  module.exports = {
    onLoad: function () {
      var AppContainer = metro.findByName("AppContainer");
      if (!AppContainer || !AppContainer.prototype) {
        console.warn("[NoteOverlay] AppContainer not found, trying App...");
        AppContainer = metro.findByName("App");
      }
      if (!AppContainer || !AppContainer.prototype) {
        console.warn("[NoteOverlay] Could not find root component.");
        return;
      }

      unpatch = patcher.after("render", AppContainer.prototype, function (_, res) {
        return React.createElement(React.Fragment, null, res, React.createElement(NoteOverlay, null));
      });
    },

    onUnload: function () {
      if (unpatch) unpatch();
    },
  };
})();
