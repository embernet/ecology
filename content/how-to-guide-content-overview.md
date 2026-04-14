---
title: "Content Overview"
---

The resources are organised by topic. Each page is designed to be a self-contained resource and typically includes the following types of content:

#### Topic Requirement
<Requirement id={`q1`} text={`Boxes formatted like this contain text directly copied from the national curriculum`} />



<NatureExample id={`n1`}
  title={`Nature Examples`}
  emoji={``}
  facts={`- Fun facts related to each example to bring the examples to life and help create memorable learning experiences.`}
>
Specific, real-world examples to illustrate the topic, each supported by factual information.
</NatureExample>



<Activity id={`a1`}
      title={`Individual, pair, group, and class activities`}
      description={`A list of suggested classroom or outside activities designed to reinforce the concepts presented and provide additional modes of learning.`}
    />



<Reflection id={`r1`}
      title={`Reflections`}
      description={`Short, end-of-lesson plenary activities designed to consolidate learning and encourage pupils to reflect on what they have learnt.`}
    />

## Adding New Resources & Unique IDs

When adding new content components across any file, it's critical to remember the following:
1. **Unique IDs:** Every resource component must have a globally unique `id` attribute (e.g., `id={\`n234\`}`). **You cannot reuse an ID**, even if you want the exact same resource to appear in two places. 
2. **Embedded Resources System:** If a resource must be referenced twice (e.g., linking a Nature Example in two different year lists), define the component inside a standalone markdown file in the `content/resources/` directory (e.g. `n234-glasswing-butterfly.md`). Then, in the curriculum pages, use `<EmbedResource id="n234" />` to render it inline. Do not duplicate the component code.
3. **Testing Changes:** After adding or modifying resources, you must always run `npm run build` in the terminal to verify that the Resource Registry builds successfully and that no duplicate IDs exist.
