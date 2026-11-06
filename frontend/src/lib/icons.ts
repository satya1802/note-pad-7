/**
 * The icon set generated screens may use: the Vue twin of the React set, drawn from the
 * same paths, each a component named `Icon<Name>` (`<IconPlus class="h-4 w-4" />`).
 *
 * The set is deliberately finite -- the Builder prompt lists exactly these names, and an
 * icon that is not here is an unknown component rather than a blank square.
 */
import { defineComponent, h, type Component, type VNode } from "vue";

const shapes: Record<string, () => VNode[]> = {
  Plus: () => [h("path", {"d": "M12 5v14M5 12h14"})],
  Search: () => [h("circle", {"cx": "11", "cy": "11", "r": "7"}), h("path", {"d": "m20 20-3.5-3.5"})],
  Check: () => [h("path", {"d": "m20 6-11 11-5-5"})],
  X: () => [h("path", {"d": "M18 6 6 18M6 6l12 12"})],
  ChevronRight: () => [h("path", {"d": "m9 18 6-6-6-6"})],
  ChevronLeft: () => [h("path", {"d": "m15 18-6-6 6-6"})],
  ChevronDown: () => [h("path", {"d": "m6 9 6 6 6-6"})],
  Menu: () => [h("path", {"d": "M4 6h16M4 12h16M4 18h16"})],
  User: () => [h("circle", {"cx": "12", "cy": "8", "r": "4"}), h("path", {"d": "M4 21c0-4 3.6-6 8-6s8 2 8 6"})],
  Users: () => [h("circle", {"cx": "9", "cy": "8", "r": "3.5"}), h("path", {"d": "M2 21c0-3.5 3-5.5 7-5.5s7 2 7 5.5"}), h("path", {"d": "M17 11a3 3 0 1 0 0-6"}), h("path", {"d": "M18 15.5c2.5.6 4 2.3 4 5.5"})],
  Settings: () => [h("circle", {"cx": "12", "cy": "12", "r": "3"}), h("path", {"d": "M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-2.9 1.2 2 2 0 1 1-4 0 1.7 1.7 0 0 0-2.9-1.2l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.7 1.7 0 0 0 4.6 15a2 2 0 1 1 0-4 1.7 1.7 0 0 0 1.2-2.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.7 1.7 0 0 0 11.5 4a2 2 0 1 1 4 0 1.7 1.7 0 0 0 2.9 1.2l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0 1.2 2.9 2 2 0 1 1 0 4 1.7 1.7 0 0 0-1.2 1.1z"})],
  Bell: () => [h("path", {"d": "M18 8a6 6 0 1 0-12 0c0 7-3 8-3 8h18s-3-1-3-8"}), h("path", {"d": "M13.7 21a2 2 0 0 1-3.4 0"})],
  Home: () => [h("path", {"d": "m3 10 9-7 9 7v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"}), h("path", {"d": "M9 21v-7h6v7"})],
  FileText: () => [h("path", {"d": "M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"}), h("path", {"d": "M14 3v5h5M9 13h6M9 17h6"})],
  Package: () => [h("path", {"d": "m12 2 9 5v10l-9 5-9-5V7z"}), h("path", {"d": "M3 7l9 5 9-5M12 12v10"})],
  Calendar: () => [h("rect", {"x": "3", "y": "5", "width": "18", "height": "16", "rx": "2"}), h("path", {"d": "M3 10h18M8 3v4M16 3v4"})],
  Clock: () => [h("circle", {"cx": "12", "cy": "12", "r": "9"}), h("path", {"d": "M12 7v5l3 2"})],
  Trash: () => [h("path", {"d": "M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"}), h("path", {"d": "M6 7v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7"})],
  Edit: () => [h("path", {"d": "M4 20h4l10-10a2.8 2.8 0 0 0-4-4L4 16z"}), h("path", {"d": "m13.5 6.5 4 4"})],
  Filter: () => [h("path", {"d": "M3 5h18l-7 8v6l-4 2v-8z"})],
  Download: () => [h("path", {"d": "M12 3v12"}), h("path", {"d": "m7 12 5 5 5-5"}), h("path", {"d": "M4 20h16"})],
  Upload: () => [h("path", {"d": "M12 17V5"}), h("path", {"d": "m7 10 5-5 5 5"}), h("path", {"d": "M4 20h16"})],
  ArrowLeft: () => [h("path", {"d": "M20 12H4"}), h("path", {"d": "m10 6-6 6 6 6"})],
  ArrowRight: () => [h("path", {"d": "M4 12h16"}), h("path", {"d": "m14 6 6 6-6 6"})],
  AlertCircle: () => [h("circle", {"cx": "12", "cy": "12", "r": "9"}), h("path", {"d": "M12 8v5M12 16h.01"})],
  CheckCircle: () => [h("circle", {"cx": "12", "cy": "12", "r": "9"}), h("path", {"d": "m8.5 12 2.5 2.5 4.5-5"})],
  MoreHorizontal: () => [h("circle", {"cx": "5", "cy": "12", "r": "1.5"}), h("circle", {"cx": "12", "cy": "12", "r": "1.5"}), h("circle", {"cx": "19", "cy": "12", "r": "1.5"})],
};

function icon(name: string, draw: () => VNode[]): Component {
  return defineComponent({
    name: `Icon${name}`,
    props: { size: { type: Number, default: 16 } },
    setup(props) {
      return () =>
        h(
          "svg",
          {
            width: props.size,
            height: props.size,
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            "stroke-width": 2,
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
            "aria-hidden": "true",
          },
          draw()
        );
    },
  });
}

/** Every icon, keyed by its component name (`IconPlus`). */
export const Icons: Record<string, Component> = Object.fromEntries(
  Object.entries(shapes).map(([name, draw]) => [`Icon${name}`, icon(name, draw)])
);

export const ICON_NAMES = Object.keys(shapes);
