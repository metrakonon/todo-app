import { useContext } from 'react';
import cn from 'classnames';
import { deleteTodo } from '../../api/todos';
import { TodoContext } from '../../Context/TodoContext';

import { Error } from '../../types/Error';

export const Footer: React.FC = () => {
  const { todos, status, setStatus, deleteTodoLocal, setError, focusInput } =
    useContext(TodoContext);

  const { activeTodoCount, completedTodoCount } = todos.reduce(
    (counts, todo) => {
      return {
        activeTodoCount: counts.activeTodoCount + Number(!todo.completed),
        completedTodoCount: counts.completedTodoCount + Number(todo.completed),
      };
    },
    { activeTodoCount: 0, completedTodoCount: 0 },
  );

  const handleStatusChange = (newStatus: string) => () => {
    setStatus(newStatus);
  };

  const handleClearAllCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    const deletePromises = completedTodos.map(todo => {
      return deleteTodo(todo.id)
        .then(() => {
          deleteTodoLocal(todo.id);
        })
        .catch(() => {
          setError(Error.DeleteTodo);
        });
    });

    await Promise.all(deletePromises);

    focusInput();
  };

  return todos.length > 0 ? (
    <>
      <footer className="todoapp__footer" data-cy="Footer">
        <span className="todo-count" data-cy="TodosCounter">
          {`${activeTodoCount} items left`}
        </span>

        <nav className="filter" data-cy="Filter">
          <a
            href="#/"
            className={cn('filter__link', { selected: status === 'all' })}
            data-cy="FilterLinkAll"
            onClick={handleStatusChange('all')}
          >
            All
          </a>

          <a
            href="#/active"
            className={cn('filter__link', { selected: status === 'active' })}
            data-cy="FilterLinkActive"
            onClick={handleStatusChange('active')}
          >
            Active
          </a>

          <a
            href="#/completed"
            className={cn('filter__link', {
              selected: status === 'completed',
            })}
            data-cy="FilterLinkCompleted"
            onClick={handleStatusChange('completed')}
          >
            Completed
          </a>
        </nav>

        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          onClick={handleClearAllCompleted}
          disabled={!completedTodoCount}
        >
          Clear completed
        </button>
      </footer>
    </>
  ) : null;
};
