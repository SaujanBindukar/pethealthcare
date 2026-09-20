const API_BASE = "http://localhost:3000";
const guideContent = document.querySelector("#guide-content");
const searchParams = new URLSearchParams(window.location.search);
const guideId = searchParams.get("id");
const breedSlug = searchParams.get("breed");

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

function addGuideHeader(container, title, description, imagePath) {
  if (imagePath) {
    const image = document.createElement("img");
    image.className = "guide-hero-image";
    image.src = imagePath;
    image.alt = `${title} care guide`;
    image.addEventListener("error", () => image.remove());
    container.append(image);
  }

  const heading = document.createElement("h1");
  heading.textContent = title;
  container.append(heading);

  if (description) {
    const summary = document.createElement("p");
    summary.textContent = description;
    container.append(summary);
  }
}

async function loadGuide() {
  if (breedSlug) {
    await loadBreedGuide();
    return;
  }

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
    addGuideHeader(
      guideContent,
      guide ? `${guide.name} care guide` : "Care guide",
      null,
      guide?.image_path,
    );

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

async function loadBreedGuide() {
  try {
    const response = await fetch(
      `${API_BASE}/api/breeds/${encodeURIComponent(breedSlug)}`,
    );
    if (!response.ok) throw new Error("Unable to load breed care plan");

    const breed = await response.json();
    guideContent.replaceChildren();
    addGuideHeader(
      guideContent,
      `${breed.name} care plan`,
      breed.description,
      breed.image_url,
    );

    if (!breed.sections.length) {
      const emptyMessage = document.createElement("p");
      emptyMessage.textContent = "No care questions are available yet.";
      guideContent.append(emptyMessage);
      return;
    }

    breed.sections.forEach((section) => addTextSection(guideContent, section));
  } catch (error) {
    console.error(error);
    guideContent.textContent =
      "We could not load this breed care plan right now.";
  }
}

loadGuide();
