# Paw Finder API Contract

| Method   | Path            | Request Body      | Success Status   | Error Statuses | Description                                 |
| :------- | :-------------- | :---------------- | :--------------- | :------------- | :------------------------------------------ |
| `GET`    | `/animals`      | _None_            | `200 Animal[]`   | `500`          | List all animals with optional search query |
| `GET`    | `/animals/:id`  | _None_            | `200 Animal`     | `404`          | Get single animal details                   |
| `POST`   | `/animals`      | `CreateAnimalDto` | `201 Animal`     | `400`          | Add new animal listing                      |
| `PATCH`  | `/animals/:id`  | `UpdateAnimalDto` | `200 Animal`     | `400, 404`     | Update an existing animal                   |
| `DELETE` | `/animals/:id`  | _None_            | `204`            | `404`          | Delete animal listing                       |
| `GET`    | `/accounts`     | _None_            | `200 Account[]`  | `500`          | List all shelter accounts                   |
| `GET`    | `/accounts/:id` | _None_            | `200 Account`    | `404`          | Get single shelter profile                  |
| `GET`    | `/categories`   | _None_            | `200 Category[]` | `500`          | List all available tags                     |
| `GET`    | `/species`      | _None_            | `200 Species[]`  | `500`          | List all species                            |
