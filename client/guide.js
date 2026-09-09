const API_BASE = "http://localhost:3000";
const guideContent = document.querySelector("#guide-content");
const guideId = new URLSearchParams(window.location.search).get("id");

function addTextSection(container, section) {
  const article = document.createElement("article");
  const heading = document.createElement("h2");
  heading.textContent = section.title || section.name || "Care information";
  article.append(heading);

  const text = section.content || section.description || section.body;
  if (text) {
    const paragraph = document.createElement("p");
    paragraph.textContent = text;
    article.append(paragraph);
  }

  section.questions?.forEach((question) => {
    const questionBlock = document.createElement("div");
    questionBlock.className = "guide-question";

    const questionHeading = document.createElement("h3");
    questionHeading.textContent = question.question;

    const answer = document.createElement("p");
    answer.textContent = question.answer;

    questionBlock.append(questionHeading, answer);
    article.append(questionBlock);
  });

  container.append(article);
}

async function loadGuide() {
  if (!guideId) {
    guideContent.textContent = "This guide could not be found.";
    return;
  }

  try {
    const [speciesResponse, sectionsResponse] = await Promise.all([
      fetch(`${API_BASE}/api/species`),
      fetch(`${API_BASE}/api/species/${encodeURIComponent(guideId)}/sections`),
    ]);

    if (!speciesResponse.ok || !sectionsResponse.ok) {
      throw new Error("Unable to load guide data");
    }

    const species = await speciesResponse.json();
    const sections = await sectionsResponse.json();
    const guide = species.find((item) => String(item.id) === guideId);

    guideContent.replaceChildren();
    const heading = document.createElement("h1");
    heading.textContent = guide ? `${guide.name} care guide` : "Care guide";
    guideContent.append(heading);

    if (!sections.length) {
      const emptyMessage = document.createElement("p");
      emptyMessage.textContent = "No guide sections are available yet.";
      guideContent.append(emptyMessage);
      return;
    }

    sections.forEach((section) => addTextSection(guideContent, section));
  } catch (error) {
    console.error(error);
    guideContent.textContent = "We could not load this guide right now.";
  }
}

loadGuide();
