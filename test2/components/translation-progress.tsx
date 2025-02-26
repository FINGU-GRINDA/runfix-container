import { motion } from "framer-motion"

interface TranslationProgressProps {
  progress: number
}

export function TranslationProgress({ progress }: TranslationProgressProps) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Translation Progress</h2>
      <div className="relative pt-1">
        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200 dark:bg-blue-700">
          <motion.div
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
          <span>{progress}% Complete</span>
          <span>{100 - progress}% Remaining</span>
        </div>
      </div>
    </div>
  )
}

