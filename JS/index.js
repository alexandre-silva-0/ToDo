document.addEventListener("DOMContentLoaded", function () {

    const buttonAddNewList = document.querySelector('.add_new_list');
    const box_lists = document.querySelector('.box_lists');
    const box_lists_content = document.querySelector('.box_lists_content');


    class List {
        constructor(name, tasks, id) {
            this.name = name;
            this.id = id;
            this.tasks = tasks;
        }
    }
    class Task {
        constructor(id, task) {
            this.id = id;
            this.task = task;
        }
    }

    function loadLists() {
        const lists = JSON.parse(localStorage.getItem('lists')) || [];
        if (lists) {
            lists.forEach((list) => {
                createButtonList(list);
                addNewList(list);
            });
        } else {
            const list_contents = document.querySelectorAll('.list_content');

            list_contents.forEach(() => {
                list_contents.forEach(content => { content.classList.remove('active') });
            });
        };

        changeList();
    }




    function saveList(list) {
        const lists = JSON.parse(localStorage.getItem("lists")) || [];
        lists.push(list);
        localStorage.setItem('lists', JSON.stringify(lists));
    }

    function saveTask(list) {
        const lists = JSON.parse(localStorage.getItem('lists')) || [];

        lists.forEach((l) => {
            if (l.id === list.id) {
                l.tasks.push(list.tasks)
            }
        });

        localStorage.setItem('lists', JSON.stringify(lists));
    }

    function addNewList(list) {
        const inputAddNewTask = document.createElement('input');
        const divListContent = document.createElement('div');
        divListContent.className = 'list_content';
        divListContent.classList.add('active');
        box_lists_content.appendChild(divListContent);

        inputAddNewTask.className = 'input_add_new_task';
        inputAddNewTask.type = 'text';
        inputAddNewTask.placeholder = 'Adicione uma tarefa...';
        divListContent.appendChild(inputAddNewTask);
        inputAddNewTask.focus();

        const ul = document.createElement('ul');
        ul.className = 'taskLists'
        divListContent.appendChild(ul);


        const doneTasks = document.createElement('div');
        doneTasks.className = 'done_tasks';

        const h1DoneTasks = document.createElement('h1');
        h1DoneTasks.innerHTML = 'Tarefas realizadas...'
        doneTasks.appendChild(h1DoneTasks);

        if (list.tasks) {
            list.tasks.forEach((t) => {
                createLi(ul, t.task, t.id, divListContent, doneTasks);
            })
        }
        inputAddNewTask.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const task = new Task(Math.random(), inputAddNewTask.value);
                if (inputAddNewTask.value.trim()) {
                    list.tasks = task;
                    saveTask(list);
                    createLi(ul, inputAddNewTask.value, task.id, divListContent, doneTasks);
                    inputAddNewTask.value = '';
                }
            }
        })
        changeList();
    }

    function createLi(ul, task, id, list_content, doneTasks) {
        const li = document.createElement('li');
        ul.appendChild(li);

        const inputCheckbox = document.createElement('input');
        inputCheckbox.type = 'checkbox';
        inputCheckbox.className = 'checkbox_input';
        list_content.appendChild(doneTasks);

        const lists = JSON.parse(localStorage.getItem('lists'));
        inputCheckbox.addEventListener('change', function () {
            if (inputCheckbox.checked) {

                const ulDoneTasks = document.createElement('ul');
                doneTasks.appendChild(ulDoneTasks);

                li.style.backgroundColor = '#459661'
                p.style.textDecoration = 'line-through';

                ulDoneTasks.appendChild(li);

                let achievedTasks = JSON.parse(localStorage.getItem('achievedTasks')) || [];
                achievedTasks = lists;
                lists.forEach((li) => {
                    achievedTasks.forEach((l) => {
                        l.tasks = li.tasks.filter((t) => t.id === id);
                        li.tasks = li.tasks.filter((t) => t.id !== id);
                    })
                });
                console.log(achievedTasks);

                localStorage.setItem('achievedTasks', JSON.stringify(achievedTasks))
                localStorage.setItem('lists', JSON.stringify(lists))


            } else {
                ul.appendChild(li);
                li.style.backgroundColor = '#55D983'
                p.style.textDecoration = 'none';

                const achievedTasks = JSON.parse(localStorage.getItem('achievedTasks'));
                achievedTasks.forEach((l) => {
                    l.tasks.forEach((t) => {

                        l.tasks = l.tasks.filter((t) => t.id !== id)

                    })
                })
                localStorage.setItem('achievedTasks', JSON.stringify(achievedTasks));

                const lists = JSON.parse(localStorage.getItem('lists')) || [];
                lists.forEach((l) => {
                    l.tasks.forEach((t) => {
                        if (t.id !== id) {
                            l.tasks.push(t);
                        }
                    }
                    );


                })
                console.log(lists);
                localStorage.setItem('lists', JSON.stringify(lists));

            }
        })

        const p = document.createElement('p');
        p.innerHTML = task;

        const buttonEdit = document.createElement('button');
        buttonEdit.classList.add('fa-regular');
        buttonEdit.classList.add('fa-pen-to-square');
        buttonEdit.classList.add('edit_task_button');

        buttonEdit.addEventListener('click', function () {
            const lists = JSON.parse(localStorage.getItem('lists'));
            inputCheckbox.remove();
            p.remove();
            buttonEdit.remove();
            buttonRemover.remove();
            const newNameTaskInput = document.createElement('input');
            newNameTaskInput.className = 'rename_task';
            li.appendChild(newNameTaskInput);
            newNameTaskInput.focus();

            newNameTaskInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    if (newNameTaskInput.value.trim()) {
                        lists.forEach((l) => {
                            l.tasks.forEach((t) => {
                                if (t.id === id) {
                                    t.task = newNameTaskInput.value;
                                    newNameTaskInput.remove();
                                }
                            })
                        })
                        localStorage.setItem('lists', JSON.stringify(lists));
                        p.innerHTML = newNameTaskInput.value;
                        li.append(inputCheckbox, p, buttonEdit, buttonRemover);
                    } else {
                        alert('Insira um nome válido!');
                    }
                }
            })

        })

        const buttonRemover = document.createElement('button');
        buttonRemover.addEventListener('click', function () {
            li.remove();
            const lists = JSON.parse(localStorage.getItem('lists')) || [];
            lists.forEach((list) => {
                list.tasks = list.tasks.filter((t) => t.id !== id);
            })
            localStorage.setItem('lists', JSON.stringify(lists));
        })

        buttonRemover.id = 'remove_btn';
        buttonRemover.classList.add('fa-solid');
        buttonRemover.classList.add('fa-trash');
        buttonRemover.classList.add('remove_button_task');
        li.append(inputCheckbox, p, buttonEdit, buttonRemover)
    }

    function changeList() {
        const list_buttons_box = document.querySelectorAll('.list_button_box');
        const list_contents = document.querySelectorAll('.list_content');

        list_buttons_box.forEach((list, index) => {
            list.addEventListener('click', function () {
                list_buttons_box.forEach((list) => list.classList.remove('active'));
                list.classList.add('active')

                list_contents.forEach(content => { content.classList.remove('active') });
                list_contents[index].classList.add('active');
            });
        });
    }

    function createButtonList(list) {
        const list_buttons = document.querySelectorAll('.list_button_box');
        list_buttons.forEach((list) => {
            list.classList.remove('active');
        });

        const list_button_box = document.createElement('div');
        list_button_box.className = 'list_button_box';
        list_button_box.classList.add('active');
        box_lists.appendChild(list_button_box);

        const buttonList = document.createElement('button');
        buttonList.className = 'list_button';
        buttonList.textContent = list.name;
        list_button_box.appendChild(buttonList);

        const editButton = document.createElement('button');
        editButton.classList.add('fa-regular');
        editButton.classList.add('fa-pen-to-square');
        editButton.classList.add('edit_list_button');
        list_button_box.appendChild(editButton);

        editButton.addEventListener('click', function () {
            const lists = JSON.parse(localStorage.getItem('lists'));

            buttonList.remove();
            editButton.remove();
            removeListButton.remove();
            const newNameListInput = document.createElement('input');
            list_button_box.appendChild(newNameListInput);
            newNameListInput.focus();

            newNameListInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    if (newNameListInput.value.trim()) {
                        lists.forEach((l) => {
                            if (l.id === list.id) {
                                l.name = newNameListInput.value;
                                newNameListInput.remove();
                            }
                        })
                        localStorage.setItem('lists', JSON.stringify(lists));
                        buttonList.textContent = newNameListInput.value;
                        list_button_box.append(buttonList, editButton, removeListButton);
                    } else {
                        alert('Insira um nome válido!');
                    }
                } else if (e.key === 'Escape') {
                    newNameListInput.remove();
                    list_button_box.append(buttonList, editButton, removeListButton);
                }

            })

        })

        const removeListButton = document.createElement('button');
        removeListButton.classList.add('fa-solid');
        removeListButton.classList.add('fa-x');
        removeListButton.classList.add('remove_list_button');
        list_button_box.appendChild(removeListButton);

        removeListButton.addEventListener('click', function () {

            list_button_box.remove();
            let lists = JSON.parse(localStorage.getItem('lists'));
            console.log(list.id);
            lists = lists.filter((l) => l.id !== list.id);
            console.log(lists);
            localStorage.setItem('lists', JSON.stringify(lists));
            location.reload();

        })

        const list_content = document.querySelectorAll('.list_content');
        list_content.forEach((list) => { list.classList.remove('active') });

    }

    buttonAddNewList.addEventListener("click", function () {
        //criando input para receber nome da lista
        const inputListName = document.createElement('input');
        box_lists.appendChild(inputListName);
        inputListName.focus();

        //ao pressionar enter, criaremos um botao que recebera o valor do input
        inputListName.addEventListener("keypress", (e) => {

            if (e.key === 'Enter') {
                if (inputListName.value.trim()) {
                    inputListName.remove();
                    const list = new List(inputListName.value, [], Math.random());
                    createButtonList(list);
                    saveList(list);
                    addNewList(list);

                }
            }

        })

    })
    loadLists();
    changeList();


    const list_buttons = document.querySelectorAll('.list_button_box');
    const content_tabs = document.querySelectorAll('.list_content');
    list_buttons.forEach((list) => {
        list.classList.remove('active');
        content_tabs.forEach((tab) => tab.classList.remove('active'));
    })

    if (list_buttons) {
        const list_button = document.querySelector('.list_button_box');
        list_button.classList.add('active');
        const content_tab = document.querySelector('.list_content');
        content_tab.classList.add('active');
    }


})