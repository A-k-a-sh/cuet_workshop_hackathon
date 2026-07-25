import React from 'react';
import { useStore } from '../../store/store';
import { useToast } from '../../store/toastStore';

export default function UserTable() {
  const { state, dispatch } = useStore();
  const { addToast } = useToast();
  const activeUser = state.currentUser;

  const handleToggleSuspend = (user) => {
    if (user.id === activeUser.id) {
      addToast('You cannot suspend yourself!', 'error');
      return;
    }

    if (user.suspended) {
      dispatch({ type: 'REINSTATE_USER', payload: { userId: user.id } });
      addToast(`User "${user.name}" reinstated.`, 'success');
    } else {
      dispatch({ type: 'SUSPEND_USER', payload: { userId: user.id } });
      addToast(`User "${user.name}" suspended.`, 'warning');
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col gap-6 text-left w-full">
      <div className="border-b border-slate-50 dark:border-slate-800 pb-3">
        <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-sm">
          User Directory Moderation
        </h3>
        <p className="text-3xs text-slate-400 dark:text-slate-500 mt-0.5">
          Suspend or reinstate accounts, moderate roles, and view access status
        </p>
      </div>

      <div className="overflow-x-auto w-full">
        <table className="w-full text-left">
          <thead>
            <tr className="text-4xs uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800">
              <th className="pb-3 pl-2">Name</th>
              <th className="pb-3">User ID</th>
              <th className="pb-3">Role</th>
              <th className="pb-3 text-center">Status</th>
              <th className="pb-3 text-right pr-2">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
            {state.users.map((user) => {
              const isCurrentUser = user.id === activeUser?.id;
              
              return (
                <tr key={user.id} className="text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800/15">
                  <td className="py-3.5 pl-2">
                    <span className={`font-bold ${user.suspended ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-slate-200'}`}>
                      {user.name}
                    </span>
                    {isCurrentUser && (
                      <span className="ml-2 text-3xs font-extrabold tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded uppercase">
                        You
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 font-mono font-semibold text-slate-400 uppercase">
                    {user.id}
                  </td>
                  <td className="py-3.5 capitalize font-semibold">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      user.role === 'shopper'
                        ? 'bg-blue-50 dark:bg-blue-950/20 text-blue-500'
                        : user.role === 'vendor'
                        ? 'bg-purple-50 dark:bg-purple-950/20 text-purple-500'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3.5 text-center">
                    {user.suspended ? (
                      <span className="bg-red-50 dark:bg-red-950/20 text-red-500 border border-red-200/50 px-2 py-0.5 rounded-full font-bold text-4xs uppercase tracking-wider">
                        Suspended
                      </span>
                    ) : (
                      <span className="bg-green-50 dark:bg-green-950/20 text-green-500 border border-green-200/50 px-2 py-0.5 rounded-full font-bold text-4xs uppercase tracking-wider">
                        Active
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 text-right pr-2">
                    <button
                      type="button"
                      disabled={isCurrentUser}
                      onClick={() => handleToggleSuspend(user)}
                      className={`text-4xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                        isCurrentUser
                          ? 'text-slate-300 dark:text-slate-700 cursor-not-allowed'
                          : user.suspended
                          ? 'text-green-500 hover:text-green-600'
                          : 'text-red-500 hover:text-red-650'
                      }`}
                    >
                      {user.suspended ? 'Reinstate' : 'Suspend'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
