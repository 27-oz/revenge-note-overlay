/**
 * Note Overlay — Revenge Plugin
 * A floating sticky note that stays on top of Discord.
 * Tap the 📝 button to open/close. Your note is saved automatically.
 */

// Grab the APIs Revenge gives every plugin
const { patcher, storage } = revenge.plugin;

// Grab React and React Native from Discord's own bundle
const React = revenge.metro.findByProps("createElement", "useState");
const {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} = revenge.metro.findByProps("View", "Text", "StyleSheet");

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  // The floating toggle button (bottom-right corner)
  fab: {
    position: "absolute",
    bottom: 80,
    right: 16,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#5865F2", // Discord blurple
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
    zIndex: 9999,
  },
  fabText: {
    fontSize: 22,
  },

  // The note card that appears when open
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
  clearBtn: {
    color: "#ED4245",
    fontSize: 11,
    fontWeight: "600",
  },
  noteInput: {
    color: "#DCDDDE",
    fontSize: 14,
    minHeight: 100,
    maxHeight: 200,
    textAlignVertical: "top",
    padding: 0,
  },
  charCount: {
    color: "#6B6F77",
    fontSize: 10,
    textAlign: "right",
    marginTop: 4,
  },
});

// ─── Component ────────────────────────────────────────────────────────────────

function NoteOverlay() {
  const [open, setOpen] = React.useState(false);
  // Load saved note text from plugin storage on first render
  const [text, setText] = React.useState(storage.noteText ?? "");

  function handleChange(val) {
    setText(val);
    storage.noteText = val; // auto-save on every keystroke
  }

  function handleClear() {
    setText("");
    storage.noteText = "";
  }

  return React.createElement(
    React.Fragment,
    null,

    // ── Floating button ──
    React.createElement(
      TouchableOpacity,
      { style: styles.fab, onPress: () => setOpen((o) => !o) },
      React.createElement(Text, { style: styles.fabText }, "📝")
    ),

    // ── Note card (only rendered when open) ──
    open &&
      React.createElement(
        KeyboardAvoidingView,
        {
          style: styles.noteCard,
          behavior: Platform.OS === "ios" ? "padding" : "height",
        },
        // Header row
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
        // Text input
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
        // Character counter
        React.createElement(
          Text,
          { style: styles.charCount },
          `${text.length}/500`
        )
      )
  );
}

// ─── Plugin entry points ───────────────────────────────────────────────────────

// We'll hold a reference to our unpatch function so we can clean up on unload
let unpatch;

export default {
  onLoad() {
    // Find the root app layer — this is what we inject the overlay into
    const AppContainer = revenge.metro.findByName("AppContainer", {
      default: true,
    });

    if (!AppContainer) {
      console.warn("[NoteOverlay] Could not find AppContainer — try reloading.");
      return;
    }

    // Patch the render of AppContainer to inject our overlay
    unpatch = patcher.after("render", AppContainer.prototype, function (_, res) {
      // res is what the original render returned (the app's root element)
      return React.createElement(
        React.Fragment,
        null,
        res,                           // original app UI, untouched
        React.createElement(NoteOverlay, null) // our overlay on top
      );
    });
  },

  onUnload() {
    // Remove our patch cleanly when the plugin is disabled
    unpatch?.();
  },
};
