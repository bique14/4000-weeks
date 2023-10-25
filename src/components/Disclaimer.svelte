<script>
  import { cls } from "../utils/cls";
</script>

<div class="h-full flex justify-center items-center">
  <div class={cls("flex flex-col w-4/5", "md:w-2/3", "xl:w-[40%]")}>
    <div
      class={cls("mb-6 italic text-xl text-right", "md:text-4xl")}
      style="font-weight: 600;"
    >
      We know time's finite, that's clear and right, yet one thing stays out of
      sight, The power to steer, our time's in rear, it's finite, let's hold it
      tight.
    </div>
    <div
      class={cls("text-sm text-justify", "md:text-xl", "xl:text-2xl")}
      style="word-spacing:-2px;"
    >
      If the average human lifespan is around 80 years, it means we have
      approximately 4,000 weeks to live. However, in today's society, The
      relentless chase for success and gain often compels us to pack life's
      moments within this fleeting reign.
      <br />
      <br />
      So, have we truly done what we aspire to do? Have we invested our time in things
      that truly matter to us? Things that may not impact the future but bring happiness
      to us in the present moment.
      <br />
      <br />
      <span class="italic"
        >Efficiency's fine, but life's the real goldmine.</span
      >
    </div>

    <div class={cls("my-4 flex flex-col gap-3 items-center", "md:my-8")}>
      <span class="block text-[12px] italic text-[#999999] text-center"
        >This application is not intended to determine your age or predict your
        lifespan. It created by inspiration from the book.</span
      >
      <button
        class={cls(
          "text-black text-xl",
          "hover:bg-black hover:text-white hover:rounded hover:px-1",
          "md:md:text-2xl",
          "xl:text-3xl"
        )}
        on:click
      >
        <span class="border-b border-black">ok</span>
      </button>
    </div>
  </div>
</div>
