import React, { useLayoutEffect, useState } from "react";
import Select from "react-select";

const ReactSelectWrapper = ({ children }) => {
  const [selects, setSelects] = useState([]);

  useLayoutEffect(() => {
    const nativeSelects = document.querySelectorAll("select.react-select");
    const upgraded = [];

    nativeSelects.forEach((el) => {
      const name = el.name;
      const value = el.value;
      const options = Array.from(el.options).map((opt) => ({
        value: opt.value,
        label: opt.text,
      }));

      const wrapper = document.createElement("div");
      wrapper.className = "react-select-wrapper";

      el.style.display = "none";
      el.parentNode.insertBefore(wrapper, el.nextSibling);

      upgraded.push({ el, wrapper, name, value, options });
    });

    setSelects(upgraded);

    return () => {
      upgraded.forEach(({ wrapper }) => {
        wrapper.remove();
      });
    };
  }, [children]);

  useLayoutEffect(() => {
    selects.forEach(({ el, wrapper, value, options }) => {
      const selected = options.find((opt) => opt.value === value);

      import("react-dom/client").then((ReactDOM) => {
        const root = ReactDOM.createRoot(wrapper);
        root.render(
          <Select
            classNamePrefix="reactSelect"
            defaultValue={selected}
            options={options}
            onChange={(selected) => {
              const event = new Event("change", { bubbles: true });
              el.value = selected?.value || "";
              el.dispatchEvent(event);
            }}
          />
        );
      });
    });
  }, [selects]);

  return <>{children}</>;
};

export default ReactSelectWrapper;
