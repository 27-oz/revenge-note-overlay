// Note Overlay — Revenge/Bunny Plugin (Settings Page approach)
// Accessible from: Settings → Plugins → Note Overlay → Settings (gear icon)

(function () {
  var metro   = window.bunny.metro;
  var storage = window.bunny.plugin.storage;

  var React = metro.findByProps("createElement", "useState");
  var RN    = metro.findByProps("View", "Text", "StyleSheet", "Dimensions", "TextInput");

  var View             = RN.View;
  var Text             = RN.Text;
  var TextInput        = RN.TextInput;
  var TouchableOpacity = RN.TouchableOpacity;
  var StyleSheet       = RN.StyleSheet;
  var ScrollView       = RN.ScrollView;

  var styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#1E1F22",
      padding: 16,
    },
    label: {
      color: "#B5BAC1",
      fontSize: 12,
      fontWeight: "600",
      textTransform: "uppercase",
      letterSpacing: 0.5,
      marginBottom: 8,
    },
    input: {
      backgroundColor: "#2B2D31",
      borderRadius: 8,
      padding: 12,
      color: "#DCDDDE",
      fontSize: 15,
      minHeight: 200,
      textAlignVertical: "top",
      borderWidth: 1,
      borderColor: "#3D3F45",
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 8,
    },
    charCount: {
      color: "#6B6F77",
      fontSize: 12,
    },
    clearBtn: {
      backgroundColor: "#ED4245",
      borderRadius: 6,
      paddingHorizontal: 14,
      paddingVertical: 6,
    },
    clearBtnText: {
      color: "#fff",
      fontWeight: "600",
      fontSize: 13,
    },
    saved: {
      color: "#57F287",
      fontSize: 12,
    },
  });

  function NoteSettingsPage() {
    var textState  = React.useState(storage.noteText || "");
    var text       = textState[0];
    var setText    = textState[1];

    var savedState = React.useState(false);
    var saved      = savedState[0];
    var setSaved   = savedState[1];

    var timerRef = React.useRef(null);

    function handleChange(val) {
      setText(val);
      storage.noteText = val;
      // show "Saved" briefly
      if (timerRef.current) clearTimeout(timerRef.current);
      setSaved(true);
      timerRef.current = setTimeout(function () { setSaved(false); }, 1200);
    }

    function handleClear() {
      setText("");
      storage.noteText = "";
    }

    return React.createElement(
      ScrollView,
      { style: styles.container, keyboardShouldPersistTaps: "handled" },
      React.createElement(Text, { style: styles.label }, "Your Note"),
      React.createElement(TextInput, {
        style: styles.input,
        value: text,
        onChangeText: handleChange,
        placeholder: "Write anything…",
        placeholderTextColor: "#6B6F77",
        multiline: true,
        maxLength: 1000,
        autoCorrect: true,
      }),
      React.createElement(
        View,
        { style: styles.row },
        React.createElement(
          Text,
          { style: styles.charCount },
          saved
            ? React.createElement(Text, { style: styles.saved }, "✓ Saved")
            : (text.length + "/1000")
        ),
        React.createElement(
          TouchableOpacity,
          { style: styles.clearBtn, onPress: handleClear },
          React.createElement(Text, { style: styles.clearBtnText }, "Clear Note")
        )
      )
    );
  }

  module.exports = {
    onLoad: function () {
      // nothing to patch — the settings page is registered via manifest
    },
    onUnload: function () {},
    // Bunny renders this component when the user taps the gear icon on the plugin
    settings: NoteSettingsPage,
  };
})();
