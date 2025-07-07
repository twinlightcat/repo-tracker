import React from "react";

type InputProps = {
  id: string;
  label: string;
  type?: "text" | "email" | "password";
  value?: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
  prefix?: string;
  placeholder?: string;
};

function Input(props: InputProps) {
  const { id, label, prefix, placeholder, value, onChange, type, disabled } =
    props;
  return (
    <div className="sm:col-span-4">
      <label htmlFor={id} className="block text-sm/6 font-medium text-gray-900">
        {label}
      </label>
      <div className="mt-2">
        <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
          <div className="shrink-0 text-base text-gray-500 select-none sm:text-sm/6">
            {prefix}
          </div>
          <input
            id={id}
            name={id}
            type={type || "text"}
            disabled={disabled}
            placeholder={placeholder}
            className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

export default Input;
