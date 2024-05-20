function SomethingWentWrong() {
  return (
    <span
      className={`flex w-full flex-col gap-2 rounded-lg border-x-[0.5px] border-t-1 border-zinc-200 bg-white px-5 py-4 text-center text-sm italic shadow-xl sm:text-base dark:border-zinc-800 dark:bg-zinc-900`}
    >
      Something went wrong! Try again.
    </span>
  );
}

export default SomethingWentWrong;
