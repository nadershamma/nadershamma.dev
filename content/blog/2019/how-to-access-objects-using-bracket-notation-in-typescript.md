---
title: "How to Access Objects Using Bracket Notation in Typescript"
date: 2019-09-18T21:45:49+01:00
draft: 
author: "Nader Al-Shamma"
description: "How to dynamically access object properties using bracket notation in Typescript"
keywords: "Typescript object bracket notation, Typescript Generics"
og_image: "/images/media/Screenshot_2019-09-17_TypeScript_playground.png"
headline_image: "/images/media/Screenshot_2019-09-17_TypeScript_playground.png"
image_src: >- 
  <a href=\"https://www.typescriptlang.org/play/index.html#code/JYOwLgpgTgZghgYwgAgJIDVgBMIHsDKwAXigN4CwAUMjcgK5QA2AXMgM5hSgDmANFbWQB3bGAAWrEHQC2AI2j9qtMRGDcxYSTPlRFAXypVQkWIhQZseACJwwcZBSU0QcaRFYcuIPgNqM4UNzuaJg4BMQQioJuWMAyrBZhhCRRtGzScIwsIZbhJFQGlFSMEGDIAG65bAmh1rb2ALwOvi5urABEVhAByFbAAQCe7an+gcGOggzZ7RpgAA7VAPSLQqsAdAO4dGB08msIuNKLEHIQWIsAGkIAjADCAKwAKgC0MAASAEwAmsO+NCJYcSsa4fAAcAAZUjQVGoNKwAOwfSG+PSpGJxaSsCa0KYdWYLZjLVZCDZbHZ7A5HE7yc5XO5PV6fH5Q4SiCTIACc92RTmQMPUmmQ9wALDyaKjfOlMtlsTRccgZmB5ksVutNttdhB9odjqdaTcHi93t9fryAUDkAA2UUs-lw5AAZktYuQhT0AG5DJQDiAOMhZNswLhfaw3o8ALIAGQAQoHgwBREpucAAbQAusgmgBBKBQOADNYwKCHAAUWFwCBkEHAayCYETJ2rYDY0YGt38bDYADlXBASwByANK4P9gCUo+QcDYyDDUdjw5ADeTYHTnsoJTKiDAwHKEFquBquWSKAAPsgpFlkGfPDxM+e6Fk11QYHQQAht8H2KUs++d3vciWEC7uArDxsBYCjqw5S4NgzS8huyB2GMgqzjGcaLkmTZ3kBTZrEhdaTtOqHzkGGGNuAa6CFuf77nelRhGwKb4aUazlJkdAoFOyAANYQJsMA5GENh2Gma6FFQQ6kWwha4FA8aIGIJaSZ+DQAHxwTQykgGswYIIwwAINxd5sN+v67vuYmjkAA\" target=\"_blank\">Typescript Playground</a>
image_alt: "Screenshot of Typescript code"
categories: "Development"
tags: "TypeScript"
---
Javascript allows you to access the properties of an object using [dot notation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Property_Accessors#Dot_notation) or [bracket notation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Property_Accessors#Bracket_notation). The latter can be quite useful if you want to search for a property's values dynamically. 

For example, let's say we are building a video page for a video website and our users want buttons to resize the given video for their convenience. As the page loads, we fetch the video metadata from the server which includes the link to the video and a selection of available sizes. 

We want to associates a button to each possible dimension for the given video. One option is to hard code each object containing the dimensions to a different callback function. Then assign each function to the `onclick` event of their respective buttons. The result will be three hardcoded `onclick` callbacks, one for each button and video.

Instead, we will assign the value of the button to the respective property name of the relevant dimensions. When we click on a button, triggering our callback function, we can get the given event's target value and use it as a property accessor. For example:

```javascript
// let us imagine the videos object was received from a server
let videos = {
  name: "Dear Diary",
  large: {
    url: "https://www.youtube.com/embed/Xw1C5T-fH2Y",
    width: 1280,
    height: 720,
  },
  medium: {
    url: "https://www.youtube.com/embed/Xw1C5T-fH2Y",
    width: 950,
    height: 540,
  },
  small: {
    url: "https://www.youtube.com/embed/Xw1C5T-fH2Y",
    width: 640,
    height: 360,
  }
};

// we have a series of buttons for toggling video sizes.
const buttons = Array.from(document.getElementsByClassName('button'));
// lets make the active video small by default 
let activeVideo = videos.small;

// We create a function that takes an event and uses the event target's value as the property accessor of our videos object.
function setActiveVideo(event) {
  activeVideo = videos[event.target.value];
}

// We assign setActiveVideo as the onclick callback to all the relevant buttons.
buttons.forEach(button => {
  button.onclick = setActiveVideo;
})
```

On the face of it, recreating this functionality with Typescript should be simple.

```ts
function setActiveVideo(event): void {
  activeVideo = videos[event.target.value];
}
```

However, attempting to access the property using its name, in the same way, will result in as error:

`Element implicitly has an 'any' type because expression of type 'any' can't be used to index type...`

Note, it is important to remember that simply accessing the property using a string accessor, e.g `videos['large']` will work but we want to access properties dynamically. 

To achieve the same functionality in typescript, we need to make use of the languages' Index type using the `keyof` keyword. Index types tell the compiler that the given property or variable is a key representing a publicly accessible property name of a given type. With the `keyof` keyword we can cast a given value to an Index type or set a variable to the property name an object.  In both cases, this is contingent on the value matching a publicly accessible property name of the given object's type. [For more information on Index types and the `keyof` keyword, check out the Typescript documentation.](https://www.typescriptlang.org/docs/handbook/advanced-types.html#index-types)

Knowing this, we can create the same functionality using Typescript:

```ts
// We want to take advantage of Typescript's types so create a couple of interfaces that model out data.
interface IVideoSize {
    url: string,
    width: number,
    height: number,
}

interface IVideoData {
    name: string,
    large: IVideoSize,
    medium: IVideoSize,
    small: IVideoSize
}

// In our fetch functionality, we would assign the returned data to an object of out model type. 
let videos: IVideoData = {
  name: "Dear Diary",
  large: {
    url: "https://www.youtube.com/embed/Xw1C5T-fH2Y",
    width: 1280,
    height: 720,
  },
  medium: {
    url: "https://www.youtube.com/embed/Xw1C5T-fH2Y",
    width: 950,
    height: 540,
  },
  small: {
    url: "https://www.youtube.com/embed/Xw1C5T-fH2Y",
    width: 640,
    height: 360,
  }
};

// we have a series of buttons for toggling video sizes.
const buttons: HTMLButtonElement[] = Array.from(document.getElementsByClassName('button')) as HTMLButtonElement[];
// lets make the active video small by default 
let activeVideo: IVideoSize  = activeVideo.small;

function setActiveVideo(event: Event): void {
    // we are expecting the event target to be a button element. We need to cast it to the expected type in order to access the property 
    let target: HTMLButtonElement = event.target as HTMLButtonElement;
//We set the activeVideo to the given value ensuring that it is cast as an Index type.
    activeVideo = videos[target.value as keyof IVideoData];
}

// We assign setActiveVideo as the onclick callback to all the relevant buttons.

buttons.forEach(button => {
  button.onclick = setActiveVideo;
})
```

We can take this a step further and use [Typescript generics](https://www.typescriptlang.org/docs/handbook/generics.html) to create a function that returns a given object. 

```ts
// credit: Typescript documentation, src https://www.typescriptlang.org/docs/handbook/advanced-types.html#index-types
function getProperty<T, K extends keyof T>(o: T, propertyName: K): T[K] {
    return o[propertyName]; // o[propertyName] is of type T[K]
}
```

This function infers the type of the object `T` and casts the property name to the key type `K`, returning the property of the object using the given key `T[K]`. [The original source and a detail explanation of the function can be found in the Typescript documentation](https://www.typescriptlang.org/docs/handbook/advanced-types.html#index-types).

In conclusion, the ability to access properties via their name and bracket notation is a powerful and flexible feature of Javascript. As demonstrated in the example above, it allows us to work dynamically with objects. Typescript is a superset of javascript that offers static type checking at compile time. This is powerful feature that helps us to build robust apps using Typescript. This, however, means that we need to play by the compilers rules. In this case it means ensuring that we tell the compiler that the dynamic value we are using to access an object's property, using bracket notation, is actually an index type of the object. We say that this can be achieved by casting the given value using the `keyof` keyword.
