import {
  AiEditorOptions,
  AiEditorEvent,
  CustomMenu,
  InnerEditor,
} from "../core/AiEditor.ts";
import { EditorEvents } from "@tiptap/core";
import { Undo } from "./menus/Undo";
import { AbstractMenuButton } from "./AbstractMenuButton.ts";
import { Redo } from "./menus/Redo";
import { Heading } from "./menus/Heading.ts";
import { FontFamily } from "./menus/FontFamily";
import { FontSize } from "./menus/FontSize";
import { Bold } from "./menus/Bold";
import { Italic } from "./menus/Italic";
import { Underline } from "./menus/Underline";
import { Strike } from "./menus/Strike";
import { Subscript } from "./menus/Subscript";
import { Superscript } from "./menus/Superscript";
import { Highlight } from "./menus/Highlight";
import { FontColor } from "./menus/FontColor";
import { Divider } from "./menus/Divider";
import { BulletList } from "./menus/BulletList";
import { OrderedList } from "./menus/OrderedList";
import { IndentDecrease } from "./menus/IndentDecrease";
import { IndentIncrease } from "./menus/IndentIncrease";
import { Align } from "./menus/Align";
import { Link } from "./menus/Link";
import { Todo } from "./menus/Todo";
import { LineHeight } from "./menus/LineHeight";
import { Quote } from "./menus/Quote";
import { Image } from "./menus/Image";
import { Video } from "./menus/Video";
import { Code } from "./menus/Code";
import { CodeBlock } from "./menus/CodeBlock";
import { Eraser } from "./menus/Eraser";
import { Hr } from "./menus/Hr";
import { Table } from "./menus/Table";
import { Break } from "./menus/Break";
import { Attachment } from "./menus/Attachment";
import { Fullscreen } from "./menus/Fullscreen";
import { Printer } from "./menus/Printer";
import { Emoji } from "./menus/Emoji";
import { Painter } from "./menus/Painter";
import { Ai } from "./menus/Ai.ts";
import tippy from "tippy.js";
import { t } from "i18next";
import { Container } from "./menus/Container.ts";
import { Custom } from "./menus/Custom.ts";

window.customElements.define("aie-undo", Undo);
window.customElements.define("aie-redo", Redo);
window.customElements.define("aie-brush", Painter);
window.customElements.define("aie-container", Container);
window.customElements.define("aie-custom", Custom);
window.customElements.define("aie-eraser", Eraser);
window.customElements.define("aie-heading", Heading);
window.customElements.define("aie-font-family", FontFamily);
window.customElements.define("aie-font-size", FontSize);
window.customElements.define("aie-bold", Bold);
window.customElements.define("aie-italic", Italic);
window.customElements.define("aie-underline", Underline);
window.customElements.define("aie-strike", Strike);
window.customElements.define("aie-link", Link);
window.customElements.define("aie-code", Code);
window.customElements.define("aie-subscript", Subscript);
window.customElements.define("aie-superscript", Superscript);
window.customElements.define("aie-highlight", Highlight);
window.customElements.define("aie-font-color", FontColor);
window.customElements.define("aie-divider", Divider);
window.customElements.define("aie-bullet-list", BulletList);
window.customElements.define("aie-ordered-list", OrderedList);
window.customElements.define("aie-indent-decrease", IndentDecrease);
window.customElements.define("aie-indent-increase", IndentIncrease);
window.customElements.define("aie-align", Align);
window.customElements.define("aie-todo", Todo);
window.customElements.define("aie-line-height", LineHeight);
window.customElements.define("aie-break", Break);
window.customElements.define("aie-quote", Quote);
window.customElements.define("aie-image", Image);
window.customElements.define("aie-video", Video);
window.customElements.define("aie-code-block", CodeBlock);
window.customElements.define("aie-hr", Hr);
window.customElements.define("aie-table", Table);
window.customElements.define("aie-attachment", Attachment);
window.customElements.define("aie-fullscreen", Fullscreen);
window.customElements.define("aie-printer", Printer);
window.customElements.define("aie-emoji", Emoji);
window.customElements.define("aie-ai", Ai);

export type MenuButtonOptions = {
  key: string;
  title: string;
  svg: string;
};

const defaultMenus = [
  "undo",
  "redo",
  "brush",
  "eraser",
  "divider",
  "heading",
  "font-family",
  "font-size",
  "divider",
  "bold",
  "italic",
  "underline",
  "strike",
  "link",
  "code",
  "subscript",
  "superscript",
  "hr",
  "todo",
  "emoji",
  "divider",
  "highlight",
  "font-color",
  "divider",
  "align",
  "line-height",
  "divider",
  "bullet-list",
  "ordered-list",
  "indent-decrease",
  "indent-increase",
  "break",
  "divider",
  "image",
  "video",
  "attachment",
  "quote",
  "container",
  "code-block",
  "table",
  "divider",
  "printer",
  "fullscreen",
];

export class Header extends HTMLElement implements AiEditorEvent {
  // template:string;
  menuButtons: AbstractMenuButton[] = [];

  constructor() {
    super();
  }

  connectedCallback() {
    const divElement = document.createElement("div");
    for (let menuButton of this.menuButtons) {
      divElement.appendChild(menuButton);
    }
    divElement.style.display = "flex";
    divElement.style.flexWrap = "wrap";
    this.appendChild(divElement);
  }

  onCreate(event: EditorEvents["create"], options: AiEditorOptions): void {
    let toolbarKeys = options.toolbarKeys || defaultMenus;

    for (let toolbarKey of toolbarKeys) {
      if (!toolbarKey) continue;

      try {
        if (typeof toolbarKey === "string") {
          toolbarKey = toolbarKey.trim();
          if (toolbarKey === "|") {
            toolbarKey = "divider";
          }
          const menuButton = document.createElement(
            "aie-" + toolbarKey
          ) as AbstractMenuButton;
          menuButton.classList.add("aie-menu-item");
          menuButton.onCreate(event, options);

          if (toolbarKey !== "divider") {
            const tip = t(toolbarKey) as string;
            tip &&
              tippy(menuButton, {
                appendTo: () =>
                  event.editor.view.dom.closest(".aie-container")!,
                content: tip,
                theme: "aietip",
                arrow: true,
                // trigger:"click",
                // interactive:true,
              });
          }
          this.menuButtons.push(menuButton);
        } else {
          const customMenuConfig = toolbarKey as CustomMenu;
          const menuButton = document.createElement("aie-custom") as Custom;
          menuButton.classList.add("aie-menu-item");
          if (customMenuConfig.id) {
            menuButton.setAttribute("id", customMenuConfig.id);
          }
          if (customMenuConfig.className) {
            menuButton.classList.add(customMenuConfig.className);
          }
          menuButton.onCreate(event, options);
          menuButton.onConfig(customMenuConfig);

          if (customMenuConfig.tip) {
            const tip = t(customMenuConfig.tip) as string;
            tip &&
              tippy(menuButton, {
                appendTo: () =>
                  event.editor.view.dom.closest(".aie-container")!,
                content: tip,
                theme: "aietip",
                arrow: true,
                // trigger:"click",
                // interactive:true,
              });
          }

          if (customMenuConfig.onCreate) {
            customMenuConfig.onCreate(
              menuButton,
              (event.editor as InnerEditor).aiEditor
            );
          }

          this.menuButtons.push(menuButton);
        }
      } catch (e) {
        console.error("Can not create toolbar by key: " + toolbarKey);
      }
    }
  }

  onTransaction(event: EditorEvents["transaction"]): void {
    for (let menuButton of this.menuButtons) {
      menuButton.onTransaction(event);
    }
  }
}
