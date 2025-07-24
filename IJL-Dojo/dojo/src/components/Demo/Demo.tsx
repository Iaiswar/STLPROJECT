import React, { useState, ReactNode, ChangeEvent, FormEvent } from 'react';

// Type definitions
interface BaseInputProps {
  label?: string;
  name: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
  disabled?: boolean;
}

interface InputProps extends BaseInputProps {
  type?: string;
}

interface TextareaProps extends BaseInputProps {
  rows?: number;
}

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends BaseInputProps {
  options: SelectOption[];
}

interface CheckboxProps {
  label?: string;
  name: string;
  checked?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
  className?: string;
  disabled?: boolean;
}

interface RadioGroupProps extends Omit<BaseInputProps, 'value'> {
  value?: string;
  options: SelectOption[];
}

interface ButtonProps {
  children: ReactNode;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  className?: string;
  disabled?: boolean;
}

interface FormProps {
    children: ReactNode;
    onSubmit: (data: Record<string, any>) => void;
    initialValues?: Record<string, any>;
    className?: string;
  }

// Base Input component
export const Input: React.FC<InputProps> = ({ 
  label, 
  name, 
  type = 'text', 
  value = '', 
  onChange, 
  error, 
  placeholder,
  required = false,
  className = '',
  disabled = false,
  ...props 
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error ? 'border-red-500' : 'border-gray-300'
        } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''} ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

// Textarea component
export const Textarea: React.FC<TextareaProps> = ({ 
  label, 
  name, 
  value = '', 
  onChange, 
  error, 
  placeholder,
  required = false,
  rows = 4,
  className = '',
  disabled = false,
  ...props 
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        rows={rows}
        disabled={disabled}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error ? 'border-red-500' : 'border-gray-300'
        } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''} ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

// Select component
export const Select: React.FC<SelectProps> = ({ 
  label, 
  name, 
  value = '', 
  onChange, 
  error, 
  options = [],
  required = false,
  className = '',
  disabled = false,
  ...props 
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error ? 'border-red-500' : 'border-gray-300'
        } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''} ${className}`}
        {...props}
      >
        <option value="">Select an option</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

// Checkbox component
export const Checkbox: React.FC<CheckboxProps> = ({ 
  label, 
  name, 
  checked = false, 
  onChange, 
  error,
  required = false,
  className = '',
  disabled = false,
  ...props 
}) => {
  return (
    <div className="mb-4">
      <div className="flex items-center">
        <input
          type="checkbox"
          id={name}
          name={name}
          checked={checked}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className={`h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded ${
            disabled ? 'cursor-not-allowed' : ''
          } ${className}`}
          {...props}
        />
        {label && (
          <label htmlFor={name} className={`ml-2 block text-sm text-gray-700 ${disabled ? 'text-gray-500' : ''}`}>
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

// Radio Group component
export const RadioGroup: React.FC<RadioGroupProps> = ({ 
  label, 
  name, 
  value = '', 
  onChange, 
  options = [], 
  error,
  required = false,
  className = '',
  disabled = false,
  ...props 
}) => {
  return (
    <div className="mb-4">
      {label && (
        <div className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </div>
      )}
      <div className="space-y-2">
        {options.map((option) => (
          <div key={option.value} className="flex items-center">
            <input
              type="radio"
              id={`${name}-${option.value}`}
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={onChange}
              required={required}
              disabled={disabled}
              className={`h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 ${
                disabled ? 'cursor-not-allowed' : ''
              } ${className}`}
              {...props}
            />
            <label 
              htmlFor={`${name}-${option.value}`} 
              className={`ml-2 block text-sm text-gray-700 ${disabled ? 'text-gray-500' : ''}`}
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

// import React, { useState, ReactNode, ChangeEvent, FormEvent } from 'react';

// Define a type for form element props
interface FormElementProps {
  name: string;
  type?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  value?: any;
  checked?: boolean;
  [key: string]: any; // Allow other props
}

// Form component with proper TypeScript typing
interface FormProps {
  children: ReactNode;
  onSubmit: (data: Record<string, any>) => void;
  initialValues?: Record<string, any>;
  className?: string;
}

export const Form: React.FC<FormProps> = ({ 
  children, 
  onSubmit, 
  initialValues = {}, 
  className = '' 
}) => {
  const [formData, setFormData] = useState<Record<string, any>>(initialValues);
  
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };
  
  // Using a type-safe approach to clone children and pass props
  const formChildren = React.Children.map(children, (child) => {
    // Skip non-element children like strings or numbers
    if (!React.isValidElement(child)) {
      return child;
    }
    
    // Check if this is a form element with a name prop
    const childProps = child.props as Partial<FormElementProps>;
    
    if (!childProps || typeof childProps.name !== 'string') {
      return child;
    }
    
    // Get the name for this form element
    const name = childProps.name;
    
    // Create new props for the cloned element
    const newProps = {
      ...childProps,
      onChange: handleChange
    };
    
    // Set the appropriate value prop based on input type
    if (name in formData) {
      if (childProps.type === 'checkbox') {
        newProps.checked = formData[name];
      } else {
        newProps.value = formData[name];
      }
    }
    
    return React.cloneElement(child, newProps);
  });
  
  return (
    <form onSubmit={handleSubmit} className={className}>
      {formChildren}
    </form>
  );
};

// Button component
export const Button: React.FC<ButtonProps> = ({ 
  children, 
  type = 'button', 
  onClick, 
  variant = 'primary',
  className = '', 
  disabled = false,
  ...props 
}) => {
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    success: 'bg-green-600 hover:bg-green-700 text-white',
  };
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${
        variants[variant]
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Example Form Component
export const ContactForm: React.FC = () => {
  const handleSubmit = (data: Record<string, any>) => {
    console.log('Form submitted:', data);
    // Handle form submission
  };
  
  return (
    <Form 
      onSubmit={handleSubmit} 
      initialValues={{ 
        name: '', 
        email: '', 
        message: '', 
        subscribe: false 
      }}
      className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md"
    >
      <h2 className="text-xl font-bold mb-6">Contact Us</h2>
      
      <Input 
        label="Name" 
        name="name" 
        placeholder="Enter your name"
        required
      />
      
      <Input 
        label="Email" 
        name="email" 
        type="email" 
        placeholder="Enter your email"
        required
      />
      
      <Textarea 
        label="Message" 
        name="message" 
        placeholder="Enter your message"
        required
      />
      
      <Checkbox 
        label="Subscribe to newsletter" 
        name="subscribe"
      />
      
      <div className="flex justify-end mt-6">
        <Button type="submit" variant="primary">
          Submit
        </Button>
      </div>
    </Form>
  );
};