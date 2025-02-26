/**
 * Utility types and functions for type manipulation and parameter handling
 */

// DeepPartial utility type to make all nested properties optional
export type DeepPartial<T> = T extends object ? {
  [P in keyof T]?: DeepPartial<T[P]>;
} : T;

/**
 * Deep merges user provided parameters with default parameters
 * @param defaults The default parameters
 * @param userParams The user provided parameters (optional)
 * @returns Merged parameters with defaults for any missing values
 */
export function mergeWithDefaults<T extends object>(defaults: T, userParams?: DeepPartial<T>): T {
  if (!userParams) return { ...defaults };
  
  const result = { ...defaults };
  
  // Use type assertion to handle the index access
  const userParamsObject = userParams as Record<string, any>;
  
  Object.keys(userParams).forEach(key => {
    const typedKey = key as keyof T;
    const userValue = userParamsObject[key];
    const defaultValue = defaults[typedKey];
    
    // If both values are objects, recursively merge them
    if (
      userValue && 
      typeof userValue === 'object' && 
      !Array.isArray(userValue) &&
      defaultValue && 
      typeof defaultValue === 'object' && 
      !Array.isArray(defaultValue)
    ) {
      result[typedKey] = mergeWithDefaults(
        defaultValue as object, 
        userValue as DeepPartial<object>
      ) as T[keyof T];
    } 
    // Otherwise use the user value if defined
    else if (userValue !== undefined) {
      result[typedKey] = userValue as T[keyof T];
    }
  });
  
  return result;
}
