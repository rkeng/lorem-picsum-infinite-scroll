# Lorem Picsum Infinite Scroll

Infinite scrolling of a list of photos from [Lorem Picsum](https://picsum.photos/) in Angular.

[Demo](https://ryankeng.com/lorem-picsum-infinite-scroll)

## Environment

### Prerequisites

Install [Node.js](https://nodejs.org/en/about/releases/).

Install the Angular CLI.

```
npm install -g @angular/cli
```


### Installation

```
git clone https://github.com/rkeng/lorem-picsum-infinite-scroll.git
npm install
ng serve --open
```

## Components

### `app-photo`

#### Properties

Name | Type | Default Value | Description
--- | --- | --- | ---
`photo` | `Photo` | `null` | Photo data (`height`, `width`, `author`, `download_url`); if not provided, `app-photo` defaults to the skeleton view.

#### Usage

##### HTML

```html
<!-- Photo card -->
<app-photo [photo]="photo"></app-photo>

<!-- Photo skeleton -->
<app-photo></app-photo>
```

#### Screenshots

Photo card | Photo skeleton
--- | ---
![Photo card](./media/photo-card.png?raw=true) | ![Photo skeleton](./media/photo-skeleton.png?raw=true)

## Design Principles

### Single Responsibility of Components

Components should be loosely-coupled. In our case, the parent component `app.component` is responsible for fetching data and populating a list of photos. Each child component `photo.component`, on the other hand, retrieves and renders that piece of data. By separating the business logic layer and the presentation layer, we as developers can easily organize the code structure and write less error-prone code.

### Performance

#### Virtual Scrolling

Displaying large lists of elements can be slow. With the `scrolling` package provided by Angular Material CDK, we are able to achieve this performantly by only rendering the items that fit on-screen. Virtual scrolling adjusts the height of the container element to be the same as the accumulative height of the elements to be rendered.

#### Image Lazy Loading

To achieve image lazy loading in Angular, we simply add the `loading="lazy"` attribute to the `img` element. This defers loading of the resource until it reaches a [calculated distance](https://web.dev/browser-level-image-lazy-loading/#distance-from-viewport-thresholds) from the viewport.
